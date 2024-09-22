import { Output, EventEmitter, ViewChild, TemplateRef, Input, Component } from '@angular/core';
import {formPromiseService} from '@form/angular';
import {GridHeader} from './types/grid-header';

@Component({
  template: ''
})
export class GridHeaderComponent {
  @Input() actionAllowed: any;
  @Output() sort: EventEmitter<GridHeader>;
  @ViewChild(TemplateRef, {static: true}) template: TemplateRef<any>;
  public headers: Array<GridHeader>;
  constructor() {
    this.headers = [];
    this.sort = new EventEmitter();
  }

  get numHeaders() {
    return this.headers.length;
  }

  load(form: formPromiseService, query?: any, columns?: Array<any>): Promise<any> {
    return Promise.resolve([]);
  }
}
