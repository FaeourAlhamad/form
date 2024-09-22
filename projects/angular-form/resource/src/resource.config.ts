import { Injectable } from '@angular/core';

export interface formResourceRouteConfig {
  index?: any;
  create?: any;
  resource?: any;
  view?: any;
  edit?: any;
  delete?: any;
}

@Injectable()
export class formResourceConfig {
  name = '';
  form = '';
  parents: any[] = [];
}
