import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { formResourceService } from '../resource.service';

@Component({
  templateUrl: './delete.component.html'
})
export class formResourceDeleteComponent {
  constructor(
    public service: formResourceService,
    public route: ActivatedRoute,
    public router: Router
  ) {}

  onDelete() {
    this.service.remove().then(() => {
      this.router.navigate(['../../'], { relativeTo: this.route });
    });
  }

  onCancel() {
    this.router.navigate(['../', 'view'], { relativeTo: this.route });
  }
}
