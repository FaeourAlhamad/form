import formMetadata from './form-metadata';

export default interface formSubmission<T = any, stateType= formSubmissionState > {
  _id?: string;
  created?: string;
  data?: T;
  form?: string;
  metadata?: formMetadata;
  modified?: string;
  owner?: string;
  project?: string;
  state?: stateType;
  _fvid?: number;
  _vid?: number;
}

export enum formSubmissionState  {
  draft = 'draft',
  submitted = 'submitted'
}
