import { Component, OnInit, EventEmitter } from '@angular/core';
import { FormManagerConfig } from '../form-manager.config';
import { FormManagerService } from '../form-manager.service';
import { ActivatedRoute, Router } from '@angular/router';
import { formAuthService } from '@form/angular/auth';
import { form } from '@form/js';

@Component({
  templateUrl: './view.component.html'
})
export class FormManagerViewComponent implements OnInit {
  public submission: any;
  public renderOptions: any;
  public onSuccess: EventEmitter<object> = new EventEmitter();
  public onError: EventEmitter<object> = new EventEmitter();
  public onSubmitDone: EventEmitter<object> = new EventEmitter();
  constructor(
    public service: FormManagerService,
    public router: Router,
    public route: ActivatedRoute,
    public config: FormManagerConfig,
    public auth: formAuthService
  ) {
    this.renderOptions = {
      saveDraft: this.config.saveDraft
    };
    this.submission = {data: {}};
  }

  ngOnInit() {
    this.service.form = new form(this.service.form.formUrl);
  }

  onSubmit(submission: any) {
    const isDraft = submission.state === 'draft';
    this.submission.data = submission.data;
    this.submission.state = isDraft ? submission.state : 'complete';
    this.service.form.saveSubmission(this.submission).then(saved => {
      this.onSubmitDone.emit(saved);
      this.onSuccess.emit();
      this.router.navigate(['../', 'submission', saved._id], {relativeTo: this.route});
    }).catch((err) => this.onError.emit(err));
  }
}
