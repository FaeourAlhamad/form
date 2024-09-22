import { EventEmitter, Injectable, Inject } from '@angular/core';
import { formAuthConfig } from './auth.config';
import { formAppConfig } from '@form/angular';
import { get, each } from 'lodash';
import { form } from '@form/js';

@Injectable()
export class formAuthService {
  public user: any;
  public authenticated = false;

  public loginForm: string;
  public onLogin: EventEmitter<object>;
  public onLogout: EventEmitter<object>;

  public registerForm: string;
  public onRegister: EventEmitter<object>;
  public onUser: EventEmitter<object>;
  public onError: EventEmitter<any>;

  public resetPassForm: string;
  public onResetPass: EventEmitter<object>;

  public ready: Promise<boolean>;
  public readyResolve: any;
  public readyReject: any;

  public projectReady?: Promise<any>;
  public accessReady?: Promise<any>;
  public userReady?: Promise<any>;
  public formAccess: any = {};
  public submissionAccess: any = {};
  public roles: any;
  public is: any = {};

  constructor(
    public appConfig: formAppConfig,
    public config: formAuthConfig
  ) {
    this.user = null;

    if (this.appConfig && this.appConfig.appUrl) {
      form.setBaseUrl(this.appConfig.apiUrl);
      form.setProjectUrl(this.appConfig.appUrl);
      form.formOnly = !!this.appConfig.formOnly;
    } else {
      console.error('You must provide an AppConfig within your application!');
    }

    this.loginForm =
      this.appConfig.appUrl +
      '/' +
      get(this.config, 'login.form', 'user/login');
    this.registerForm =
      this.appConfig.appUrl +
      '/' +
      get(this.config, 'register.form', 'user/register');
    this.resetPassForm =
      this.appConfig.appUrl +
      '/' +
      get(this.config, 'resetpass.form', 'resetpass');
    this.onLogin = new EventEmitter();
    this.onLogout = new EventEmitter();
    this.onRegister = new EventEmitter();
    this.onUser = new EventEmitter();
    this.onError = new EventEmitter();

    this.ready = new Promise((resolve: any, reject: any) => {
      this.readyResolve = resolve;
      this.readyReject = reject;
    });

    // Register for the core events.
    form.events.on('form.badToken', () => this.logoutError());
    form.events.on('form.sessionExpired', () => this.logoutError());
    if (!this.config.delayAuth) {
      this.init();
    }
  }

  onLoginSubmit(submission: object) {
    this.setUser(submission);
    this.onLogin.emit(submission);
  }

  onRegisterSubmit(submission: object) {
    this.setUser(submission);
    this.onRegister.emit(submission);
  }

  onResetPassSubmit(submission: object) {
    this.onResetPass.emit(submission);
  }

  init() {
    this.projectReady = form.makeStaticRequest(this.appConfig.appUrl).then(
      (project: any) => {
        each(project.access, (access: any) => {
          this.formAccess[access.type] = access.roles;
        });
      },
      (): any => {
        this.formAccess = {};
        return null;
      }
    );

    // Get the access for this project.
    this.accessReady = form.makeStaticRequest(
      this.appConfig.appUrl + '/access'
    )
      .then((access: any) => {
        each(access.forms, (form: any) => {
          this.submissionAccess[form.name] = {};
          form.submissionAccess.forEach((subAccess: any) => {
            this.submissionAccess[form.name][subAccess.type] = subAccess.roles;
          });
        });
        this.roles = access.roles;
        return access;
      })
      .catch((err): any => {
        if (err === 'Token Expired' || err === 'Bad Token') {
          this.setUser(null);
        }
        this.roles = {};
        return null;
      })

    let currentUserPromise: Promise<any>;
    if (this.config.oauth) {
      // Make a fix to the hash to remove starting "/" that angular might put there.
      if (window.location.hash && window.location.hash.match(/^#\/access_token/)) {
        history.pushState(null, null, window.location.hash.replace(/^#\/access_token/, '#access_token'));
      }

      // Initiate the SSO if they provide oauth settings.
      currentUserPromise = form.ssoInit(this.config.oauth.type, this.config.oauth.options);
    } else {
      currentUserPromise = form.currentUser(null, {
        ignoreCache: true
      });
    }

    this.userReady = currentUserPromise.then((user: any) => {
      this.setUser(user);
      return user;
    }).catch((err) => {
      this.setUser(null);
      throw err;
    });

    // Trigger we are redy when all promises have resolved.
    if (this.accessReady) {
      this.accessReady
        .then(() => this.projectReady)
        .then(() => this.userReady)
        .then(() => this.readyResolve(true))
        .catch((err: any) => this.readyReject(err));
    }
  }

  setUser(user: any) {
    const namespace = form.namespace || 'form';
    if (user) {
      this.user = user;
      localStorage.setItem(`${namespace}AppUser`, JSON.stringify(user));
      this.setUserRoles();
      form.setUser(user);
    } else {
      this.user = null;
      this.is = {};
      localStorage.removeItem(`${namespace}AppUser`);
      form.clearCache();
      form.setUser(null);
    }

    this.authenticated = !!form.getToken();
    this.onUser.emit(this.user);
  }

  setUserRoles() {
    if (this.accessReady) {
      this.accessReady.then(() => {
        each(this.roles, (role: any, roleName: string) => {
          if (this.user.roles.indexOf(role._id) !== -1) {
            this.is[roleName] = true;
          }
        });
      });
    }
  }

  logoutError() {
    this.setUser(null);
    const namespace = form.namespace || 'form';
    localStorage.removeItem(`${namespace}Token`);
    this.onError.emit();
  }

  logout() {
    const namespace = form.namespace || 'form';
    const tokenName = `${namespace}Token`;

    localStorage.removeItem(tokenName);
    if ((form as any).tokens && (form as any).tokens.hasOwnProperty(tokenName)) {
      delete (form as any).tokens[tokenName];
    }

    form.logout()
      .then(() => {
        this.setUser(null);
        if (localStorage.getItem(`${namespace}LogoutAuthUrl`)) {
          window.open(localStorage.getItem(`${namespace}LogoutAuthUrl`), null, 'width=1020,height=618');
          localStorage.removeItem(`${namespace}LogoutAuthUrl`);
        }
        this.onLogout.emit();
      })
      .catch(() => this.logoutError());
  }
}
