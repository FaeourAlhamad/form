import { Inject, Injectable, InjectionToken } from '@angular/core';
export const form_CONFIG = new InjectionToken('form-config');
import { form } from '@form/js';

@Injectable()
export class formAppConfig {
  [x: string]: any;
  appUrl = '';
  apiUrl = '';
  icons?: string;
  formOnly?: boolean;
  form?: form;
  constructor(@Inject(form_CONFIG) config: {
    apiUrl?: string,
    baseUrl?: string, 
    appUrl?: string,
    projectUrl?: string 
  } = {}) {
    this.apiUrl = config.apiUrl || config.baseUrl;
    this.appUrl = config.appUrl || config.projectUrl;
    if (this.apiUrl) {
      form.setBaseUrl(this.apiUrl);
      form.setProjectUrl(this.appUrl);
      this.form = new form(this.appUrl);
    }
  }
}
