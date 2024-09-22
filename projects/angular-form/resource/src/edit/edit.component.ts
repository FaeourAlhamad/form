import {Component, EventEmitter, OnDestroy} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { formResourceService } from '../resource.service';
import { formResourceConfig } from '../resource.config';
import { form } from '@form/js';

@Component({
  templateUrl: './edit.component.html'
})
export class formResourceEditComponent implements OnDestroy {
  public triggerError: EventEmitter<any> = new EventEmitter();
  public onSubmitDone: EventEmitter<object> = new EventEmitter();
  public submission = {data: {}};
  constructor(
    public service: formResourceService,
    public route: ActivatedRoute,
    public router: Router,
    public config: formResourceConfig
  ) {}

  onSubmit(submission: any) {
    const edit = this.service.resource;
    edit.data = submission.data;
    this.service.save(edit)
      .then(() => {
        this.onSubmitDone.emit(this.service.resource);
        this.router.navigate(['../', 'view'], { relativeTo: this.route });
      })
      .catch((err) => this.triggerError.emit(err));
  }

  ngOnDestroy() {
    form.clearCache();
  }
}
