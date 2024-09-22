import { Component } from '@angular/core';
import { formAuthService } from '../auth.service';
@Component({
  templateUrl: './login.component.html'
})
export class formAuthLoginComponent {
  public renderOptions: any = {
    submitOnEnter: true
  };
  constructor(public service: formAuthService) {}
}
