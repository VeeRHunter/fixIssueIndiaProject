import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {CreatePractitioner} from "./create-practitioner";

@NgModule({
  declarations: [
    CreatePractitioner,
  ],
  imports: [
    IonicPageModule.forChild(CreatePractitioner),
  ],
  exports: [
    CreatePractitioner
  ]
})
export class CreatePractitionerModule {}
