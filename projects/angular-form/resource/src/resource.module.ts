import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { formModule } from '@form/angular';
import { formAlerts } from '@form/angular';
import { formGrid } from '@form/angular/grid';
import { formResourceComponent } from './resource.component';
import { formResourceViewComponent } from './view/view.component';
import { formResourceEditComponent } from './edit/edit.component';
import { formResourceDeleteComponent } from './delete/delete.component';
import { formResourceCreateComponent } from './create/create.component';
import { formResourceIndexComponent } from './index/index.component';
import { formResourceRouteConfig } from './resource.config';
import { formResourceRoutes } from './resource.routes';
import { extendRouter } from '@form/angular';

@NgModule({
  imports: [
    CommonModule,
    formModule,
    formGrid,
    RouterModule
  ],
  declarations: [
    formResourceComponent,
    formResourceCreateComponent,
    formResourceIndexComponent,
    formResourceViewComponent,
    formResourceEditComponent,
    formResourceDeleteComponent
  ],
  providers: [
    formAlerts
  ]
})
export class formResource {
  static forChild(config?: formResourceRouteConfig): any {
    return extendRouter(formResource, config, formResourceRoutes);
  }
  static forRoot(config?: formResourceRouteConfig): any {
    return extendRouter(formResource, config, formResourceRoutes);
  }
}
