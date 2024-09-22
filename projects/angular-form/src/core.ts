if (window && typeof (window as any).global === 'undefined') {
  (window as any).global = window;
}
export * from './form.config';
export * from './form.common';
export * from './form.service';
export * from './form-promise.service';
export * from './form.utils';
export * from './formBaseComponent';
export * from './components/form/form.component';
export * from './components/formbuilder/formbuilder.component';
export * from './components/formreport/formreport.component';
export * from './components/loader/form.loader.component';
export * from './components/alerts/form.alerts';
export * from './components/alerts/form.alerts.component';
export { formModule } from './form.module';
export { ComponentSchema, ExtendedComponentSchema, ElementInfo } from '@form/deprecated-types';
export { Utils as formUtils } from '@form/js';
export { form } from '@form/js';
