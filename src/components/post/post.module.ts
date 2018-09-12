import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { PostComponent } from './post';
import {ProfileLeavesComponentModule} from "../profile-leaves/profile-leaves.module";
import {AwardKarmaComponentModule} from "../award-karma/award-karma.module";

@NgModule({
  declarations: [
    PostComponent,
  ],
  imports: [
    IonicModule,
    ProfileLeavesComponentModule,
    AwardKarmaComponentModule
  ],
  exports: [
    PostComponent
  ],
  entryComponents:[
    PostComponent
  ]
})
export class PostComponentModule {}
