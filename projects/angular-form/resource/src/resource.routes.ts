import { Routes } from '@angular/router';
import { formResourceComponent } from './resource.component';
import { formResourceViewComponent } from './view/view.component';
import { formResourceEditComponent } from './edit/edit.component';
import { formResourceDeleteComponent } from './delete/delete.component';
import { formResourceCreateComponent } from './create/create.component';
import { formResourceIndexComponent } from './index/index.component';
import { formResourceRouteConfig } from './resource.config';
export function formResourceRoutes(config?: formResourceRouteConfig): Routes {
  return [
    {
      path: '',
      component: config && config.index ? config.index : formResourceIndexComponent
    },
    {
      path: 'new',
      component: config && config.create ? config.create : formResourceCreateComponent
    },
    {
      path: ':id',
      component: config && config.resource ? config.resource : formResourceComponent,
      children: [
        {
          path: '',
          redirectTo: 'view',
          pathMatch: 'full'
        },
        {
          path: 'view',
          component: config && config.view ? config.view : formResourceViewComponent
        },
        {
          path: 'edit',
          component: config && config.edit ? config.edit : formResourceEditComponent
        },
        {
          path: 'delete',
          component: config && config.delete ? config.delete : formResourceDeleteComponent
        }
      ]
    }
  ];
}
