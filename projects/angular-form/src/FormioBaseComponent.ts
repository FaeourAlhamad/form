import { Component, ElementRef, EventEmitter, Input, NgZone, OnChanges, OnDestroy, OnInit, Optional, Output, ViewChild } from '@angular/core';
import { formService } from './form.service';
import { formAlerts } from './components/alerts/form.alerts';
import { formAppConfig } from './form.config';
import { formError, formForm, formOptions, formRefreshValue } from './form.common';
import { assign, get, isEmpty } from 'lodash';
import { CustomTagsService } from './custom-tags.service';
import { Utils } from '@form/js';
import { AlertsPosition } from './types/alerts-position';
const { Evaluator, fastCloneDeep } = Utils;

@Component({
  template: ''
})
export class formBaseComponent implements OnInit, OnChanges, OnDestroy {
  @Input() form?: formForm;
  @Input() submission?: any = {};
  @Input() src?: string;
  @Input() url?: string;
  @Input() service?: formService;
  @Input() options?: formOptions;
  @Input() noeval ? = Evaluator.noeval;
  @Input() formOptions?: any;
  @Input() renderOptions?: any;
  @Input() readOnly ? = false;
  @Input() viewOnly ? = false;
  @Input() hideLoading ? = false;
  @Input() hideComponents?: string[];
  @Input() refresh?: EventEmitter<formRefreshValue>;
  @Input() error?: EventEmitter<any>;
  @Input() success?: EventEmitter<object>;
  @Input() submitDone?: EventEmitter<object>;
  @Input() language?: EventEmitter<string>;
  @Input() hooks?: any = {};
  @Input() renderer?: any;
  @Input() watchSubmissionErrors ? = false;
  @Input() dataTableActions? : any = []
  @Output() render = new EventEmitter<object>();
  @Output() customEvent = new EventEmitter<object>();
  @Output() fileUploadingStatus = new EventEmitter<string>();
  @Output() submit = new EventEmitter<object>();
  @Output() prevPage = new EventEmitter<object>();
  @Output() nextPage = new EventEmitter<object>();
  @Output() beforeSubmit = new EventEmitter<object>();
  @Output() rowAdd = new EventEmitter<any>();
  @Output() rowAdded = new EventEmitter<any>();
  @Output() rowEdit = new EventEmitter<any>();
  @Output() rowEdited = new EventEmitter<any>();
  @Output() rowDelete = new EventEmitter<any>();
  @Output() rowClick = new EventEmitter<any>();
  @Output() rowSelectChange = new EventEmitter<any>();
  @Output() page = new EventEmitter<any>();
  @Output() changeItemsPerPage = new EventEmitter<any>();
  @Output() change = new EventEmitter<object>();
  @Output() invalid = new EventEmitter<boolean>();
  @Output() errorChange = new EventEmitter<any>();
  @Output() formLoad = new EventEmitter<any>();
  @Output() submissionLoad = new EventEmitter<any>();
  @Output() ready = new EventEmitter<formBaseComponent>();
  @ViewChild('form', { static: true }) formElement?: ElementRef<any>;

  public AlertsPosition = AlertsPosition;
  public form: any;
  public initialized = false;
  public alerts = new formAlerts();
  public formReady: Promise<any>;

  private formReadyResolve: any;
  private submitting = false;
  private submissionSuccess = false;
  public isLoading: boolean;
  public noAlerts: boolean;
  public label: string;

  constructor(
    public ngZone: NgZone,
    @Optional() public config: formAppConfig,
    @Optional() public customTags?: CustomTagsService,
  ) {
    this.isLoading = true;
    this.formReady = new Promise((ready) => {
      this.formReadyResolve = ready;
    });
  }

  getRenderer() {
    return this.renderer;
  }

  getRendererOptions() {
    const extraTags = this.customTags ? this.customTags.tags : [];
    return assign({}, {
      icons: get(this.config, 'icons', 'fontawesome'),
      noAlerts: get(this.options, 'noAlerts', true),
      readOnly: this.readOnly,
      viewAsHtml: this.viewOnly,
      ...(this.viewOnly && { renderMode: "html" }),
      i18n: get(this.options, 'i18n', null),
      fileService: get(this.options, 'fileService', null),
      hooks: this.hooks,
      sanitizeConfig: {
        addTags: extraTags
      },
      dataTableActions: this.dataTableActions
    }, this.renderOptions || {});
  }

  createRenderer() {
    const Renderer = this.getRenderer();
    const form = (new Renderer(
      this.formElement ? this.formElement.nativeElement : null,
      this.form,
      this.getRendererOptions()
    ));
    return form.instance;
  }

  setFormUrl(url) {
    this.form.setUrl(url, this.formOptions || {});
  }

  setForm(form: formForm) {
    this.form = form;
    if (this.form) {
      this.form.destroy();
    }

    if (this.form.title) {
      this.label = this.form.title;
    } else if (this.form.components && this.form.components[0]) {
      this.label = this.form.components[0].label;
    }

    // Clear out the element to render the new form.
    if (this.formElement && this.formElement.nativeElement) {
      this.formElement.nativeElement.innerHTML = '';
    }
    this.form = this.createRenderer();

    if(!this.form) {
      return;
    }
    this.form.setSubmission(this.submission, {
      fromSubmission: false
    });
    if (this.renderOptions && this.renderOptions.validateOnInit) {
      this.form.setValue(this.submission, {validateOnInit: true});
    }
    if (this.url) {
      this.setFormUrl(this.url);
    }
    if (this.src) {
      this.setFormUrl(this.src);
    }
    this.form.nosubmit = true;
    this.attachFormEvents();

    return this.form.ready.then(() => {
      this.ngZone.run(() => {
        this.isLoading = false;
        this.ready.emit(this);
        this.formReadyResolve(this.form);
        if (this.form.submissionReady) {
          this.form.submissionReady.then((submission) => {
            this.submissionLoad.emit(submission);
          });
        }
      });
      return this.form;
    });
  }

  attachFormEvents() {
    this.form.on('prevPage', (data: any) => this.ngZone.run(() => this.onPrevPage(data)));
    this.form.on('nextPage', (data: any) => this.ngZone.run(() => this.onNextPage(data)));
    this.form.on('change', (value: any, flags: any, isModified: boolean) => this.ngZone.run(() => this.onChange(value, flags, isModified)));
    this.form.on('rowAdd', (component: any) =>  this.ngZone.run(() => this.rowAdd.emit(component)));
    this.form.on('rowAdded', (data: any, component: any) =>  this.ngZone.run(() => this.rowAdded.emit({component, row: data})));
    this.form.on('rowEdit', (data: any, rowIndex: number, index: number, component: any) =>  this.ngZone.run(() => this.rowEdit.emit({component, row: data, rowIndex, index})));
    this.form.on('rowEdited', (data: any, rowIndex: number, component: any) =>  this.ngZone.run(() => this.rowEdited.emit({component, row: data, rowIndex})));
    this.form.on('rowDelete', (data: any, rowIndex: number, index: number, component: any) =>  this.ngZone.run(() => this.rowDelete.emit({component, row: data, rowIndex, index})));
    this.form.on('rowClick', (row: any, rowIndex: number, index: number,component: any) =>  this.ngZone.run(() => this.rowClick.emit({component, row, rowIndex, index})));
    this.form.on('rowSelectChange', (selectedRows: any[], component: any) =>  this.ngZone.run(() => this.rowSelectChange.emit({selectedRows, component})));
    this.form.on('page', (currentPage: number, component: any) =>  this.ngZone.run(() => this.page.emit({currentPage, component})));
    this.form.on('changeItemsPerPage', (itemsPerPage:number) =>  this.ngZone.run(() => this.changeItemsPerPage.emit({itemsPerPage})));
    this.form.on('customEvent', (event: any) =>
      this.ngZone.run(() => this.customEvent.emit(event))
    );

    ['fileUploadingStart', 'fileUploadingEnd'].forEach((eventName, index) => {
      const status = !!index ? 'end' : 'start';
      this.form.on(eventName, () =>
        this.ngZone.run(() => this.fileUploadingStatus.emit(status))
      );
    });

    this.form.on('submit', (submission: any, saved: boolean) =>
      this.ngZone.run(() => this.submitForm(submission, saved))
    );
    this.form.on('error', (err: any) => this.ngZone.run(() => {
      this.submissionSuccess = false;
      return this.onError(err);
    }));
    this.form.on('render', () => this.ngZone.run(() => this.render.emit()));
    this.form.on('formLoad', (loadedForm: any) =>
      this.ngZone.run(() => this.formLoad.emit(loadedForm))
    );
  }

  initialize() {
    if (this.initialized) {
      return;
    }

    const extraTags = this.customTags ? this.customTags.tags : [];
    const defaultOptions: formOptions = {
      errors: {
        message: 'Please fix the following errors before submitting.'
      },
      alerts: {
        submitMessage: 'Submission Complete.'
      },
      disableAlerts: false,
      hooks: {
        beforeSubmit: null
      },
      sanitizeConfig: {
        addTags: extraTags
      },
      alertsPosition: AlertsPosition.top,
    };
    this.options = Object.assign(defaultOptions, this.options);
    if (this.options.disableAlerts) {
      this.options.alertsPosition = AlertsPosition.none;
    }
    this.initialized = true;
  }

  ngOnInit() {
    Evaluator.noeval = this.noeval;
    this.initialize();

    if (this.language) {
      if (typeof this.language === 'string') {
        this.form.language = this.language;
      } else {
        this.language.subscribe((lang: string) => {
          this.form.language = lang;
        });
      }
    }

    if (this.refresh) {
      this.refresh.subscribe((refresh: formRefreshValue) =>
        this.onRefresh(refresh)
      );
    }

    if (this.error) {
      this.error.subscribe((err: any) => this.onError(err));
    }

    if (this.success) {
      this.success.subscribe((message: string) => {
        this.alerts.setAlert({
          type: 'success',
          message: message || get(this.options, 'alerts.submitMessage')
        });
      });
    }

    if (this.submitDone) {
      this.submitDone.subscribe((submission: object) => {
        this.form.emit('submitDone', submission);
      });
    }

    if (this.src) {
      if (!this.service) {
        this.service = new formService(this.src);
      }
      this.isLoading = true;
      this.setFormFromSrc();
    }
    if (this.url && !this.service) {
      this.service = new formService(this.url);
    }
  }

  setFormFromSrc() {
    this.service.loadForm({ params: { live: 1 } }).subscribe(
      (form: formForm) => {
        if (form && form.components) {
          this.ngZone.runOutsideAngular(() => {
            this.setForm(form);
          });
        }

        // if a submission is also provided.
        if (
          isEmpty(this.submission) &&
          this.service &&
          this.service.form.submissionId
        ) {
          this.service.loadSubmission().subscribe(
            (submission: any) => {
              if (this.readOnly) {
                this.form.options.readOnly = true;
              }
              this.submission = this.form.submission = submission;
            },
            err => this.onError(err)
          );
        }
      },
      err => this.onError(err)
    );
  }

  ngOnDestroy() {
    if (this.form) {
      this.form.destroy();
    }
  }

  onRefresh(refresh: formRefreshValue) {
    this.formReady.then(() => {
      if (refresh.form) {
        this.form.setForm(refresh.form).then(() => {
          if (refresh.submission) {
            this.form.setSubmission(refresh.submission);
          }
        });
      } else if (refresh.submission) {
        this.form.setSubmission(refresh.submission);
      } else {
        switch (refresh.property) {
          case 'submission':
            this.form.submission = refresh.value;
            break;
          case 'form':
            this.form.form = refresh.value;
            break;
        }
      }
    });
  }

  ngOnChanges(changes: any) {
    Evaluator.noeval = this.noeval;
    this.initialize();

    if (changes.form && changes.form.currentValue) {
      this.ngZone.runOutsideAngular(() => {
        this.setForm(changes.form.currentValue);
      });
    }

    this.formReady.then(() => {
      if (changes.submission && changes.submission.currentValue) {
        this.form.setSubmission(changes.submission.currentValue, {
          fromSubmission: !changes.submission.firstChange
        });
      }

      if (changes.hideComponents && changes.hideComponents.currentValue) {
        const hiddenComponents = changes.hideComponents.currentValue;
        this.form.options.hide = hiddenComponents;
        this.form.everyComponent((component) => {
          component.options.hide = hiddenComponents;
          if (hiddenComponents.includes(component.component.key)) {
            component.visible = false;
          }
        });
      }
    });
  }

  onPrevPage(data: any) {
    this.alerts.setAlerts([]);
    this.prevPage.emit(data);
  }

  onNextPage(data: any) {
    this.alerts.setAlerts([]);
    this.nextPage.emit(data);
  }

  onSubmit(submission: any, saved: boolean, noemit?: boolean) {
    this.submitting = false;
    this.submissionSuccess = true;

    this.form.setValue(fastCloneDeep(submission), {
      noValidate: true,
      noCheck: true
    });

    if (saved) {
      this.form.emit('submitDone', submission);
    }
    if (!noemit) {
      this.submit.emit(submission);
    }
    if (!this.success) {
      this.alerts.setAlert({
        type: 'success',
        message: get(this.options, 'alerts.submitMessage')
      });
    }
  }

  onError(err: any) {
    this.alerts.setAlerts([]);
    this.submitting = false;
    this.isLoading = false;

    if (!err) {
      return;
    }

    // Make sure it is an array.
    const errors = Array.isArray(err) ? err : [err];

    // Emit these errors again.
    this.errorChange.emit(errors);

    if (err.silent) {
      return;
    }

    if (this.form && errors.length) {
      this.form.emit('submitError', errors);
    }

    // Iterate through each one and set the alerts array.
    errors.forEach((error: any) => {
      const {
        message,
        paths,
      } = error
        ? error.details
          ? {
            message: error.details.map((detail) => detail.message),
            paths: error.details.map((detail) => detail.path),
          }
          : {
            message: error.message || error.toString(),
            paths: (error.path || error.formattedKeyOrPath) ? [error.path || error.formattedKeyOrPath] : [],
          }
        : {
          message: '',
          paths: [],
        };

      let shouldErrorDisplay = true;

      if (this.form) {
        paths.forEach((path, index) => {
          const component = this.form.getComponent(path);
          if (component) {
            const components = Array.isArray(component) ? component : [component];
            const messageText = Array.isArray(message) ? message[index] : message;
            components.forEach((comp) => comp.setCustomValidity(messageText, true));
            this.alerts.addAlert({
              type: 'danger',
              message: Array.isArray(message) ? message[index] : message,
              component,
            });
            shouldErrorDisplay = false;
          }
        });

        if ((window as any).VPAT_ENABLED) {
          if (typeof error ==='string' && this.form.components) {
            this.form.components.forEach((comp) => {
              if (comp && comp.type !== 'button') {
                comp.setCustomValidity(message, true);
              }
            });
          }
        }
      }

      if (shouldErrorDisplay) {
        this.alerts.addAlert({
          type: 'danger',
          message,
          component: error.component,
        });
      }
    });

    if (this.form && !this.noAlerts) {
      this.form.showErrors(errors);
    }
  }

  focusOnComponet(key: any) {
    if (this.form) {
      this.form.focusOnComponent(key);
    }
  }

  submitExecute(submission: object, saved = false) {
    if (this.service && !this.url && !saved) {
      this.service
        .saveSubmission(submission)
        .subscribe(
          (sub: {}) => this.onSubmit(sub, true),
          err => this.onError(err)
        );
    } else {
      this.onSubmit(submission, false);
    }
  }

  submitForm(submission: any, saved = false) {
    // Keep double submits from occurring...
    if (this.submitting) {
      return;
    }
    this.form.setMetadata(submission);
    this.submissionSuccess = false;
    this.submitting = true;
    this.beforeSubmit.emit(submission);

    // if they provide a beforeSubmit hook, then allow them to alter the submission asynchronously
    // or even provide a custom Error method.
    const beforeSubmit = get(this.options, 'hooks.beforeSubmit');
    if (beforeSubmit) {
      beforeSubmit(submission, (err: formError, sub: object) => {
        if (err) {
          this.onError(err);
          return;
        }
        this.submitExecute(sub, saved);
      });
    } else {
      this.submitExecute(submission, saved);
    }
  }

  onChange(value: any, flags: any, isModified: boolean) {
    if (this.watchSubmissionErrors && !this.submissionSuccess) {
      const errors = get(this, 'form.errors', []);
      const alerts = get(this, 'alerts.alerts', []);
      const submitted = get(this, 'form.submitted', false);
      if (submitted && (errors.length || alerts.length)) {
        this.onError(errors);
      }
    }
    return this.change.emit({...value, flags, isModified});
  }
}
