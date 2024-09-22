import { Component } from '@angular/core';
import { formAuthService } from '../auth.service';
@Component({
  templateUrl: './register.component.html'
})
export class formAuthRegisterComponent {
  public renderOptions: any = {
    submitOnEnter: true
  };
  constructor(public service: formAuthService) {}
}
