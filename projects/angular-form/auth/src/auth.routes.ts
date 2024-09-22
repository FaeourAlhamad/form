import { Routes } from '@angular/router';
import { formAuthRouteConfig } from './auth.config';
import { formAuthComponent } from './auth.component';
import { formAuthLoginComponent } from './login/login.component';
import { formAuthRegisterComponent } from './register/register.component';
import { formResetPassComponent } from './resetpass/resetpass.component';

export function formAuthRoutes(config?: formAuthRouteConfig): Routes {
  return [
    {
      path: '',
      component: config && config.auth ? config.auth : formAuthComponent,
      children: [
        {
          path: '',
          redirectTo: 'login',
          pathMatch: 'full'
        },
        {
          path: 'login',
          component: config && config.login ? config.login : formAuthLoginComponent
        },
        {
          path: 'register',
          component: config && config.register ? config.register : formAuthRegisterComponent
        },
        {
          path: 'resetpass',
          component: config && config.resetpass ? config.resetpass : formResetPassComponent
        }
      ]
    }
  ];
}
