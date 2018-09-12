import {PostImage} from "./postImage";
import {Profile} from "./profile";

export class Post {
  constructor(public id: string,
              public parent_post: Post,
              public body: string,
              public video_url: string,
              public post_image: PostImage,
              public post_image_url: string,
              public youtube_video_key: string,
              public youtube_url_key: string,
              public profile: Profile,
              public published: string,
              public post_replies: any,
              public total_karma_points: any,
              public karma_points_added: any,
              public created_at: string,
              public updated_at: string) {
  }

}