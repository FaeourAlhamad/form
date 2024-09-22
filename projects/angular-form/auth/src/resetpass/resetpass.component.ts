import { Component } from '@angular/core';
import { formAuthService } from '../auth.service';
@Component({
  templateUrl: './resetpass.component.html'
})
export class formResetPassComponent {
  constructor(public service: formAuthService) {}
}
