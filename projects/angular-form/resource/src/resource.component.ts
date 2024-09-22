import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterEvent } from '@angular/router';
import { formAuthService } from '@form/angular/auth';
import { formResourceService } from './resource.service';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './resource.component.html'
})
export class formResourceComponent implements OnInit, OnDestroy {
  public perms = {delete: false, edit: false};
  public routerSubscription: Subscription;

  constructor(
    public service: formResourceService,
    public route: ActivatedRoute,
    public auth: formAuthService,
    public router: Router
  ) {}

  ngOnInit() {
    this.init();
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.init();
      }
    });
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }

  init() {
    return this.service.init(this.route).then(() => 
      this.auth.ready.then(() => 
        this.service.formform.userPermissions(
          this.auth.user, 
          this.service.form, 
          this.service.resource
        ).then((perms) => {
          this.perms.delete = perms.delete;
          this.perms.edit = perms.edit;
          return this.service.resource;
        })
    ));
  }
}
