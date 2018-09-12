import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {FOP} from "./fop";
import {ComponentsModule} from "../../../components/components.module";

@NgModule({
  declarations: [
    FOP,
  ],
  imports: [
    IonicPageModule.forChild(FOP),
    ComponentsModule
  ],
  exports: [
    FOP
  ]
})
export class FOPModule {
}
