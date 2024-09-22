import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { formAlerts } from './form.alerts';

@Component({
  selector: 'form-alerts',
  templateUrl: './form.alerts.component.html'
})
export class formAlertsComponent implements OnInit {
  @Input() alerts: formAlerts;
  @Output() focusComponent = new EventEmitter<object>();
  ngOnInit() {
    if (!this.alerts) {
      this.alerts = new formAlerts();
    }
  }
  getComponent (event, alert) {
    this.focusComponent.emit(alert.component.key);
  }
}
