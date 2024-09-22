import { Injectable } from '@angular/core';
import { formAppConfig } from '@form/angular';
import { FormManagerConfig } from './form-manager.config';
import { form } from '@form/js';
import { ActivatedRoute } from '@angular/router';
import { formAuthService } from '@form/angular/auth';
import _intersection from 'lodash/intersection';

@Injectable()
export class FormManagerService {
  public form: form;
  public access: any;
  public allAccessMap: any;
  public ownAccessMap: any;
  public ready: Promise<any>;
  public formReady: Promise<any>;
  public actionAllowed: any;
  public form = null;
  public formSrc = '';
  public perms = {delete: false, edit: false};

  constructor(
    public appConfig: formAppConfig,
    public config: FormManagerConfig,
    public auth: formAuthService
  ) {
    if (this.appConfig && this.appConfig.appUrl) {
      form.setBaseUrl(this.appConfig.apiUrl);
      form.setProjectUrl(this.appConfig.appUrl);
    } else {
      console.error('You must provide an AppConfig within your application!');
    }

    this.allAccessMap = {
      'update_all': 'formEdit',
      'delete_all': 'formDelete'
    };
    this.ownAccessMap = {
      'update_own': 'formEdit',
      'delete_own': 'formDelete'
    };
    this.actionAllowed = (action) => this.isActionAllowed(action);
    this.reset();
  }

  isActionAllowed(action: string) {
    return this.access[action];
  }

  setAccess() {
    this.access = {
      formCreate: true,
      formView: true,
      formSubmission: true,
      formEdit: true,
      formPermission: true,
      formDelete: true,
      projectSettings: true,
      userManagement: true
    };
    if (this.auth) {
      this.access = {
        formCreate: false,
        formView: false,
        formSubmission: false,
        formEdit: false,
        formPermission: false,
        formDelete: false,
        projectSettings: false,
        userManagement: false
      };
      this.ready = this.auth.ready.then(() => {
        let administrator = this.auth.roles["administrator"];
        let formbuilder = this.auth.roles["formbuilder"];
        let formadmin = this.auth.roles["formadmin"];

        if (this.auth.user && this.auth.user.roles) {
          this.auth.user.roles.forEach((roleId: string) => {
            if (administrator._id === roleId) {
              this.access.formCreate = true;
              this.access.formView = true;
              this.access.formSubmission= true;
              this.access.formEdit = true;
              this.access.formPermission = true;
              this.access.formDelete = true;
              this.access.projectSettings = true;
              this.access.userManagement = true;
            }
            else {
              if (formadmin && formadmin._id === roleId) {
                this.access.formCreate = this.auth.formAccess.create_all.includes(roleId);
                this.access.formEdit = this.auth.formAccess.update_all.includes(roleId);
                this.access.formPermission = this.auth.formAccess.update_all.includes(roleId);
                this.access.formDelete =  this.auth.formAccess.delete_all.includes(roleId);
                this.access.formView = this.auth.formAccess.read_all.includes(roleId);
                this.access.formSubmission = this.auth.formAccess.read_all.includes(roleId);
              }
              if (formbuilder && formbuilder._id === roleId) {
                this.access.formCreate = this.auth.formAccess.create_all.includes(roleId);
                this.access.formEdit = this.auth.formAccess.update_all.includes(roleId);
                this.access.formPermission = this.auth.formAccess.update_all.includes(roleId);
                this.access.formDelete =  this.auth.formAccess.delete_all.includes(roleId);
                this.access.formView = this.auth.formAccess.read_all.includes(roleId);
              }
            }
          });
        }
      });
    } else {
      this.ready = Promise.resolve(false);
    }
  }

  reset(route?: ActivatedRoute) {
    if (route) {
      route.params.subscribe(params => {
        if (params.id) {
          this.form = new form(`${this.form.formsUrl}/${params.id}`);
        } else {
          this.reset();
        }
      });
    } else {
      this.form = new form(this.appConfig.appUrl);
      this.setAccess();
    }
  }

  hasAccess(roles) {
    if (!this.auth.user) {
      return false;
    }
    return !!_intersection(roles, this.auth.user.roles).length;
  }

  setForm(form: any) {
    this.form = form;
    this.formSrc = this.appConfig.appUrl + '/' + form.path;
    if (form.access) {
      // Check if they have access here.
      form.access.forEach(access => {
        // Check for all access.
        if (this.allAccessMap[access.type] && !this.access[this.allAccessMap[access.type]]) {
          this.access[this.allAccessMap[access.type]] = this.hasAccess(access.roles);
        }

        // Check for own access.
        if (
          this.auth && this.auth.user &&
          (form._id === this.auth.user._id) &&
          this.ownAccessMap[access.type] &&
          !this.access[this.ownAccessMap[access.type]]
        ) {
          this.access[this.ownAccessMap[access.type]] = this.hasAccess(access.roles);
        }
      });
    }
    return form;
  }

  loadForm() {
    this.form = null;
    this.formReady = this.form.loadForm().then(form => this.setForm(form));
    return this.formReady;
  }

  setSubmission(route: ActivatedRoute) {
    return new Promise((resolve) => {
      route.params.subscribe(params => {
        this.form = new form(`${this.form.submissionsUrl}/${params.id}`);
        resolve(this.form);
      });
    });
  }

  submissionLoaded(submission: any) {
    this.auth.ready.then(() => {
      this.form.userPermissions(this.auth.user, this.form, submission).then((perms) => {
        this.perms.delete = perms.delete;
        this.perms.edit = perms.edit;
      });
    });
  }

  loadForms() {
    return this.form.loadForms({params: {
      tags: this.config.tag
    }});
  }
}
