import { ExtendedComponentSchema, ValidateOptions } from '@form/deprecated-types';
import { AlertsPosition } from './types/alerts-position';

export interface ComponentOptions<T = any, V extends ValidateOptions = ValidateOptions> extends ExtendedComponentSchema<T> {
  validate?: V;
}

export interface formRefreshValue {
  property?: string;
  value?: object;
  form?: object;
  submission?: object;
}

export interface AccessSetting {
  type: string;
  roles: string[];
}

export interface formReport {
  form: string,
  roles: object,
  access: object,
  metadata: object,
  data: object,
  project: string,
}

export interface formForm {
  title?: string;
  display?: string;
  name?: string;
  path?: string;
  type?: string;
  project?: string;
  template?: string;
  components?: ExtendedComponentSchema[];
  tags?: string[];
  access?: AccessSetting[];
  submissionAccess?: AccessSetting[];
  report?: formReport
}

export interface ComponentInstance {
  component: ExtendedComponentSchema;
  id: string;
  type: string;
  asString?(value: any): string;
  getView(value: any): string;
}

export interface AlertsOptions {
  submitMessage: string;
}

export interface ErrorsOptions {
  message: string;
}

export class formError {
  constructor(
    public message: string,
    public component: ExtendedComponentSchema,
    public silent?: boolean,
  ) {}
}

export type formSubmissionCallback = (
  error: formError,
  submission: object
) => void;
export type formBeforeSubmit = (
  submission: object,
  callback: formSubmissionCallback
) => void;

export interface formHookOptions {
  beforeSubmit: formBeforeSubmit;
}

export interface formOptions {
  errors?: ErrorsOptions;
  alerts?: AlertsOptions;
  alertsPosition?: AlertsPosition;
  disableAlerts?: boolean;
  i18n?: object;
  fileService?: object;
  hooks?: formHookOptions;
  sanitizeConfig?: any;
}
