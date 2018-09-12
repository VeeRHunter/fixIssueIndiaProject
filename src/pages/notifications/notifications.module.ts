import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {Notifications} from "./notifications";
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    Notifications,
  ],
  imports: [
    IonicPageModule.forChild(Notifications),
    ComponentsModule
  ],
  exports: [
    Notifications
  ]
})
export class NotificationsModule {}
