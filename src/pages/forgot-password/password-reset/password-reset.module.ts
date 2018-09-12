import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {PasswordReset} from "./password-reset";

@NgModule({
  declarations: [
    PasswordReset,
  ],
  imports: [
    IonicPageModule.forChild(PasswordReset),
  ],
  exports: [
    PasswordReset
  ]
})
export class PasswordResetModule {}
