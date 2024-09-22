import { from } from 'rxjs';
import { formService } from './form.service';
import { formForm } from './form.common';

export class formPromiseService {
  private formService: formService;

  constructor(public url: string, public options?: object) {
    this.formService = new formService(url, options);
  }

  saveForm(form: formForm, options?: any): Promise<any> {
    return this.formService.saveForm(form, options).toPromise();
  }
  loadForm(query?: any, options?: any): Promise<any> {
    return this.formService.loadForm(query, options).toPromise();
  }
  loadSubmission(query?: any, options?: any): Promise<any> {
    return this.formService.loadSubmission(query, options).toPromise();
  }
  userPermissions(user: any, form: any, submission: any): Promise<any> {
    return this.formService.userPermissions(user, form, submission).toPromise();
  }
  deleteSubmission(data?: any, options?: any): Promise<any> {
    return this.formService.deleteSubmission(data, options).toPromise();
  }
  loadForms(query: any, options?: any): Promise<any> {
    return this.formService.loadForms(query, options).toPromise();
  }
  saveSubmission(submission: {}, options?: any): Promise<any> {
    return this.formService.saveSubmission(submission, options).toPromise();
  }
  loadSubmissions(query?: any, options?: any): Promise<any> {
    return this.formService.loadSubmissions(query, options).toPromise();
  }
}
