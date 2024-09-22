import {Component, OnDestroy} from '@angular/core';
import { formResourceService } from '../resource.service';
import { formResourceConfig } from '../resource.config';
import {form} from '@form/js';

@Component({
  templateUrl: './view.component.html'
})
export class formResourceViewComponent implements OnDestroy{
  constructor(
    public service: formResourceService,
    public config: formResourceConfig
  ) {}
  public submission = {data: {}};

  ngOnDestroy() {
    form.clearCache();
  }
}
