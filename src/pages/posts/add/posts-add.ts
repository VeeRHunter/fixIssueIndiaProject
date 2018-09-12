import {Component, ViewChild} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  AlertController,
  ActionSheetController
} from 'ionic-angular';
import {Profile as ProfileModel} from "../../../models/profile";
import {PostService} from "../../../service/post";
import {Post} from "../../../models/post";
import {Keyboard} from 'ionic-native';
import {Camera} from "ionic-native";

@IonicPage({name: "post-add", segment: "post-add"})
@Component({
  selector: 'page-posts-add',
  templateUrl: 'posts-add.html',
})
export class PostsAdd {

  public dataLoading: boolean = true;
  public profile: ProfileModel;
  public parentPost: Post;
  public posts: any;
  public post: any = {
    body: ''
  };
  public profileImage: any;
  public postImage: any;
  public toggled: boolean;
  @ViewChild('focusInput') myInput;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private postService: PostService,
              private actionSheetCtrl: ActionSheetController) {

    this.profile = this.navParams.get('profile');
    this.parentPost = this.navParams.get('parentPost');

    this.profileImage = this.getUserProfileImage(this.profile);
  }

  ionViewLoaded() {
    setTimeout(() => {
      Keyboard.show();
      this.myInput.setFocus();
    }, 150); //a least 150ms.
  }

  handleSelection(event) {
    this.post.body += " " + event.char;
    this.toggled = false;
  }

  goBackPage() {
    this.navCtrl.pop();
  }

  youtubeGetVideoId(url) {
    url = url.split(/(vi\/|v%3D|v=|\/v\/|youtu\.be\/|\/embed\/)/);

    return undefined !== url[2] ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0];
  }

  onPostSave() {
    let error = false;

    if (!this.post.body) {
      const alert = this.alertCtrl.create({
        title: 'An error occurred!',
        message: 'Please add the content for your post',
        buttons: ['Ok']
      });
      alert.present();
      error = true;
    }

    if (!error) {
      let postData = {
        body: this.post.body,
        published: true,
        post_image: this.postImage,
        profile: {
          id: this.profile.id
        },
        parent_post: {
          id: (this.parentPost && this.parentPost.hasOwnProperty('id')) ? this.parentPost.id : null
        }
      };

      if(this.post.hasOwnProperty('youtube_video_key')
        && undefined !== this.post.youtube_video_key
        && '' !== this.post.youtube_video_key)
      {
        let youtubeVideoKey = this.youtubeGetVideoId(this.post.youtube_video_key);
        if (undefined !== youtubeVideoKey) {
          postData['youtube_video_key'] = youtubeVideoKey;
        }
      }

      const loading = this.loadingCtrl.create({
        spinner: 'hide',
        content: `
      <div class="custom-spinner-container">
        <img src="assets/customSpinner.svg">
      </div>`
      });
      loading.present();

      //create a new post
      if (this.parentPost) {

        let replyData = {
          parent_post: {
            id: this.parentPost.id
          },
          post_data: postData
        };

        this.postService.postReply(replyData).subscribe(
          (response) => {
            this.dataLoading = false;
            loading.dismiss();

            this.navCtrl.pop();
          },
          (errors) => {
            this.dataLoading = false;
            loading.dismiss();
            this.handleError(errors);
          }
        );

        //reply to a post
      } else {

        this.postService.createOne(postData).subscribe(
          (response) => {
            this.dataLoading = false;
            loading.dismiss();

            this.navCtrl.pop();
          },
          (errors) => {
            this.dataLoading = false;
            loading.dismiss();
            this.handleError(errors);
          }
        );

      }

    }
  }

  getUserProfileImage(profile: ProfileModel) {
    let profileImage = 'assets/images/no-person-image.jpg';

    if (profile.hasOwnProperty('profile_image') && profile.profile_image.small_url != null) {
      profileImage = profile.profile_image.small_url;
    }

    return profileImage;
  }

  onAddPostImage() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Upload photo',
      buttons: [
        {
          text: 'Take photo',
          handler: () => {
            this.onTakePhoto();
          }
        }, {
          text: 'Choose photo',
          handler: () => {
            this.accessGallery();
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    actionSheet.present();
  }

  onTakePhoto() {
    Camera.getPicture({
      encodingType: Camera.EncodingType.JPEG,
      correctOrientation: true
    })
      .then(
        imageData => {
          const toDataURL = url => fetch(url)
            .then(response => response.blob())
            .then(blob => new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.onerror = reject;
              reader.readAsDataURL(blob)
            }));

          this.postImage = {
            body: null,
            extension: "jpg"
          };

          toDataURL(imageData)
            .then(dataUrl => {
              let image = dataUrl.toString();
              image = image.replace('data:;base64,', '');

              this.postImage.body = image;

            });
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      );
  }

  accessGallery() {
    Camera.getPicture({
      sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
      destinationType: Camera.DestinationType.DATA_URL
    }).then((imageData) => {
      this.postImage = {
        body: imageData,
        extension: "jpg"
      };

    }, (err) => {
      console.log(err);
    });
  }

  private handleError(errors: any) {
    let errorMessage = '';
    for (let error of errors) {
      errorMessage += '<p>' + error.message + " </p>";
    }

    const alert = this.alertCtrl.create({
      title: 'An error occurred!',
      message: errorMessage,
      buttons: ['Ok']
    });
    alert.present();
  }

  public removeImage() {
    delete this.postImage;
  }
}