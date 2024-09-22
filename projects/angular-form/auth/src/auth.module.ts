import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { formModule } from '@form/angular';
import { formAuthComponent } from './auth.component';
import { formAuthLoginComponent } from './login/login.component';
import { formAuthRegisterComponent } from './register/register.component';
import { formResetPassComponent } from './resetpass/resetpass.component';
import { formAuthRouteConfig } from './auth.config';
import { formAuthRoutes } from './auth.routes';
import { extendRouter } from '@form/angular';

@NgModule({
  imports: [
    CommonModule,
    formModule,
    RouterModule
  ],
  declarations: [
    formAuthComponent,
    formAuthLoginComponent,
    formAuthRegisterComponent,
    formResetPassComponent
  ]
})
export class formAuth {
  static forRoot(config?: formAuthRouteConfig): any {
    return extendRouter(formAuth, config, formAuthRoutes);
  }
  static forChild(config?: formAuthRouteConfig): any {
    return extendRouter(formAuth, config, formAuthRoutes);
  }
}
