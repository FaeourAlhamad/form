import { Observable, Observer } from 'rxjs';
import { formForm } from './form.common';
import { formCore as form } from '@form/js';

export class formService {
  public form: any;
  constructor(public url: string, public options?: object) {
    this.form = new form(this.url, this.options);
  }
  requestWrapper(fn: any) {
    let record: any;
    let called = false;
    return Observable.create((observer: Observer<any>) => {
      try {
        if (!called) {
          called = true;
          fn()
            .then((_record: any) => {
              record = _record;
              observer.next(record);
              observer.complete();
            })
            .catch((err: any) => observer.error(err));
        } else if (record) {
          observer.next(record);
          observer.complete();
        }
      } catch (err) {
        observer.error(err);
      }
    });
  }
  saveForm(form: formForm, options?: any): Observable<formForm> {
    return this.requestWrapper(() => this.form.saveForm(form, options));
  }
  loadForm(query?: any, options?: any): Observable<formForm> {
    return this.requestWrapper(() => this.form.loadForm(query, options));
  }
  loadForms(query: any, options?: any): Observable<formForm> {
    return this.requestWrapper(() => this.form.loadForms(query, options));
  }
  loadSubmission(query?: any, options?: any): Observable<{}> {
    return this.requestWrapper(() => this.form.loadSubmission(query, options));
  }
  userPermissions(user: any, form: any, submission: any): Observable<{}> {
    return this.requestWrapper(() => this.form.userPermissions(user, form, submission));
  }
  deleteSubmission(data?: any, options?: any): Observable<{}> {
    return this.requestWrapper(() => this.form.deleteSubmission(data, options));
  }
  saveSubmission(submission: {}, options?: any): Observable<{}> {
    return this.requestWrapper(() => this.form.saveSubmission(submission, options));
  }
  loadSubmissions(query?: any, options?: any): Observable<{}> {
    return this.requestWrapper(() => this.form.loadSubmissions(query, options));
  }
}
