import { Injectable, EventEmitter } from '@angular/core';
import { formAuthService } from '@form/angular/auth';

export interface formResourceMap {
  [name: string]: any;
}

@Injectable()
export class formResources {
  resources: formResourceMap = {};
  error: EventEmitter<any>;
  onError: EventEmitter<any>;
  constructor(
    public auth?: formAuthService
  ) {
    this.error = new EventEmitter();
    this.onError = this.error;
    this.resources = {
      currentUser: {
        resourceLoaded: this.auth.userReady
      }
    };
  }
}
