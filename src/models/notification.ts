import {Post} from "./post";
import {Profile} from "./profile";

export class Notification {
  constructor(public id: string,
              public post: Post,
              public awarded_to_post: Post,
              public profile: Profile,
              public awarding_profile: Profile,
              public reply_profile: Profile,
              public follower_profile: Profile,
              public is_read: boolean,
              public type: string,
              public points_awarded: string,
              public updated_at: string) {
  }

}