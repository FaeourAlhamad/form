import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { formResourceService } from '../resource.service';
import { formResourceConfig } from '../resource.config';
import { each } from 'lodash';

@Component({
  templateUrl: './index.component.html'
})
export class formResourceIndexComponent implements OnInit {
  public gridSrc?: string;
  public gridQuery: any;
  public createText: String;

  constructor(
    public service: formResourceService,
    public route: ActivatedRoute,
    public router: Router,
    public config: formResourceConfig,
    public cdr: ChangeDetectorRef,
    public ngZone: NgZone,
  ) {
  }

  ngOnInit() {
    this.service.init(this.route).then(() => {
      this.gridQuery = {};
      if (
        this.service &&
        this.config.parents &&
        this.config.parents.length
      ) {
        this.service.loadParents().then((parents: any) => {
          each(parents, (parent: any) => {
            if (parent && parent.filter) {
              this.gridQuery['data.' + parent.name + '._id'] =
                parent.resource._id;
            }
          });

          // Set the source to load the grid.
          this.gridSrc = this.service.formUrl;
          this.createText = `New ${this.service.form.title}`;
          this.cdr.detectChanges();
        });
      } else if (this.service.formUrl) {
        this.gridSrc = this.service.formUrl;
        this.createText = `New ${this.service.form.title}`;
      }
    });
  }

  onSelect(row: any) {
    this.ngZone.run(() => {
      this.router.navigate([row._id, 'view'], { relativeTo: this.route });
    });
  }

  onCreateItem() {
    this.ngZone.run(() => {
      this.router.navigate(['new'], { relativeTo: this.route });
    });
  }
}
