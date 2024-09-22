import { Component } from '@angular/core';
import { FormManagerService } from '../../form-manager.service';
import { ActivatedRoute, Router } from '@angular/router';
import { formAlerts } from '@form/angular';

@Component({
  templateUrl: './delete.component.html'
})
export class SubmissionDeleteComponent {
  constructor(
    public service: FormManagerService,
    public router: Router,
    public route: ActivatedRoute,
    public alerts: formAlerts
  ) {}

  onDelete() {
    this.service.form.deleteSubmission().then(() => {
      this.router.navigate(['../../'], { relativeTo: this.route });
    }).catch(err => this.alerts.setAlert({type: 'danger', message: (err.message || err)}));
  }

  onCancel() {
    this.router.navigate(['../', 'view'], { relativeTo: this.route });
  }
}
