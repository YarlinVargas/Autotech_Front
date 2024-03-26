import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndexRoutingModule } from './index-routing.module';
import { LoginComponent } from './login/login/login.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RECAPTCHA_LANGUAGE, RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    LoginComponent,
  ],
  imports: [
    CommonModule,
    IndexRoutingModule,
    FontAwesomeModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: RECAPTCHA_LANGUAGE,
      useValue: "es", // use spanish language
    },
  ],
})
export class IndexModule { }
