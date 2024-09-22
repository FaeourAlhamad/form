import { Component, EventEmitter, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { formResourceService } from '../resource.service';
import { formResourceConfig } from '../resource.config';

@Component({
  styleUrls: ['./create.component.scss'],
  templateUrl: './create.component.html'
})
export class formResourceCreateComponent implements OnInit {
  public onError: EventEmitter<any>;
  public onSuccess: EventEmitter<any>;
  constructor(
    public service: formResourceService,
    public route: ActivatedRoute,
    public router: Router,
    public config: formResourceConfig
  ) {
    this.onError = new EventEmitter();
    this.onSuccess = new EventEmitter();
  }

  ngOnInit(): void {
    this.service.init(this.route);
  }

  onSubmit(submission: any) {
    this.service
      .save(submission)
      .then(() => {
        this.router.navigate(['../', this.service.resource._id, 'view'], {
          relativeTo: this.route
        });
      })
      .catch((err: any) => this.onError.emit(err));
  }
}
