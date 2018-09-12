import { NgModule } from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {PostMenu} from "./post-menu";

@NgModule({
  declarations: [
    PostMenu,
  ],
  imports: [
    IonicPageModule.forChild(PostMenu),
  ],
  entryComponents: [
    PostMenu,
  ]
})
export class PostMenuModule {}