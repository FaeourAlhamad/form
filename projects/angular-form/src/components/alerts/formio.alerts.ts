export interface formAlert {
  type: string;
  message: string;
  component?: any;
}

export class formAlerts {
  public alerts: formAlert[] = [];

  setAlert(alert: formAlert) {
    this.alerts = [alert];
  }

  addAlert(alert: formAlert) {
    this.alerts.push(alert);
  }

  setAlerts(alerts: formAlert[]) {
    this.alerts = alerts;
  }
}
