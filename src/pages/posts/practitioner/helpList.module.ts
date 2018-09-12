import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {PostComponentModule} from "../../../components/post/post.module";
import {HelpList} from "./helpList";
import {ComponentsModule} from "../../../components/components.module";

@NgModule({
  declarations: [
    HelpList,
  ],
  imports: [
    IonicPageModule.forChild(HelpList),
    PostComponentModule,
    ComponentsModule
  ],
  exports: [
    HelpList
  ]
})
export class HelpListModule {
}
