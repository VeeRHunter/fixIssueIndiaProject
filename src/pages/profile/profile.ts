import {Component, ViewChild} from "@angular/core";
import {
  IonicPage, LoadingController, NavController, ActionSheetController, AlertController,
  ToastController
} from "ionic-angular";
import {DomSanitizer} from "@angular/platform-browser";
import {PersonalizeBranch} from "../personalize-branch/personalize-branch";
import {ProfileService} from "../../service/profile";
import {Profile as ProfileModel} from "../../models/profile";
import {DoMore} from "../do-more/do-more";
import {PostService} from "../../service/post";
import {PostsAdd} from "../posts/add/posts-add";
import {MoodService} from "../../service/mood";
import {MoodChangeService} from "../../service/moodChange";
import {Camera} from "ionic-native";
import {PostComponent} from "../../components/post/post";
import {ProfileProvider} from "../../service/profile-provider";
import {NotificationService} from "../../service/notification";
import {ProfilePrivacy} from "../profile-privacy/profile-privacy";

@IonicPage({name: "profile-list", segment: "profile-list" })
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class Profile {

  public dataLoading: boolean = true;
  public personalizeBranchPage = PersonalizeBranch;
  public userProfile: ProfileModel = null;
  public userImageBg: any;
  public userImage: any;
  public displayMoodBar: boolean = false;
  public moods: any;
  public mood: any;
  public currentMoodClass: any = '';
  public posts: any;
  public lastRequestDate: any;

  public GENDER_MALE = 0;
  public GENDER_FEMALE = 1;
  public GENDER_INDETERMINATE = 2;
  public GENDER_INTERSEX = 3;
  public GENDER_OTHER = 4;

  @ViewChild(PostComponent) postComponent: PostComponent;

  constructor(private profileService: ProfileService,
              private sanitizer: DomSanitizer,
              private loadingCtrl: LoadingController,
              private navCtrl: NavController,
              private actionSheetCtrl: ActionSheetController,
              private alertCtrl: AlertController,
              private toastCtrl: ToastController,
              private postService: PostService,
              private moodService: MoodService,
              private moodChangeService: MoodChangeService,
              public profileProvider: ProfileProvider,
              private notificationService: NotificationService) {
  }

  ionViewWillEnter() {
    this.loadData();
  }

  //reload post listing if an action was made in child (post component)
  handleReload(isReloadNeeded) {
    if (true == isReloadNeeded) {
      this.loadData();
    }
  }

  private loadData() {

    this.dataLoading = true;
    const loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `
      <div class="custom-spinner-container">
        <img src="assets/customSpinner.svg">
      </div>`
    });
    loading.present();

    //get Profile
    this.profileService.getCurrent().subscribe(
      (profile) => {
        this.userProfile = profile;

        //console.log(this.userProfile);
        this.userImage = this.getUserProfileImage(this.userProfile);
        this.userImageBg = this.sanitizer.bypassSecurityTrustStyle('url(' + this.userImage + ')');

        if (this.userProfile.hasOwnProperty('current_mood')) {
          this.mood = this.userProfile.current_mood;
          this.currentMoodClass = this.mood.mood;
        }

        //get moods
        this.moodService.getAll().subscribe(
          (moods) => {
            this.moods = moods;

            //get ToL
            this.postService.getOwnTreeOfLife().subscribe(
              (posts) => {
                this.posts = posts;
                this.dataLoading = false;
                this.setLastRequestDate(posts);

                this.notificationService.triggerNotificationCount().subscribe(
                  (count) => {
                    this.dataLoading = false;
                    loading.dismiss();
                  },
                  (errors) => {
                    this.dataLoading = false;
                    loading.dismiss();
                  }
                )
              },
              (errors) => {
                console.log(errors);

                this.dataLoading = false;
                loading.dismiss();
              }
            );
          },
          (errors) => {
            console.log(errors);

            this.dataLoading = false;
            loading.dismiss();
          }
        );
      },
      () => {
        loading.dismiss();
      }
    );
  }


  doInfinite(infiniteScroll) {
    if (null !== this.lastRequestDate) {
      this.postService.getOwnTreeOfLife(null, this.lastRequestDate).subscribe(
        (posts) => {
          for (let post of posts) {
            this.posts.push(post);
          }
          this.setLastRequestDate(posts);
          infiniteScroll.complete();
        },
        (errors) => {
          console.log(errors);
        }
      );
    } else {
      infiniteScroll.complete();
    }
  }

  setLastRequestDate(posts) {
    if (posts.length > 0) {
      let lastPostDate = posts[posts.length - 1].post.created_at;

      this.lastRequestDate = new Date(lastPostDate).getTime() / 1000;

    } else {
      this.lastRequestDate = null;
    }
  }

  getUserProfileImage(profile: ProfileModel) {
    let profileImage = 'assets/images/no-person-image.jpg';

    if (profile.hasOwnProperty('profile_image') && profile.profile_image.small_url != null) {
      profileImage = profile.profile_image.small_url;
    }

    return profileImage;
  }

  public getAge(dateOfBirth) {
    if (!dateOfBirth) {
      return;
    }
    if ('string' === typeof dateOfBirth) {
      dateOfBirth = new Date(dateOfBirth);
    }
    let ageDifMs = Date.now() - dateOfBirth.getTime();
    let ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  onPersonalizeBranch() {
    this.navCtrl.push(PersonalizeBranch, {
      profile: this.userProfile
    })
  }

  onDoMore() {
    this.navCtrl.push(DoMore, {
      profile: this.userProfile
    })
  }

  onPostAdd() {
    this.navCtrl.push(PostsAdd, {
      profile: this.userProfile
    })
  }

  onMoodChange() {
    this.displayMoodBar = true;
  }

  onMoodSelect(mood: any) {

    // const loading = this.loadingCtrl.create({
    //   content: 'Saving ...'
    // });
    // loading.present();

    this.displayMoodBar = false;

    let data = {
      mood: {
        id: mood.id
      },
      profile: {
        id: this.userProfile.id
      }
    };

    //get current mood
    this.moodChangeService.createOne(data).subscribe(
      (moodChange) => {
        this.mood = moodChange.mood;
        this.currentMoodClass = this.mood.mood;
        // loading.dismiss();
      },
      (errors) => {
        console.log(errors);
        // loading.dismiss();
      }
    );

  }

  onProfileEdit() {
    this.navCtrl.push(ProfilePrivacy, {
      profile: this.userProfile
    });
  }

  onChangeProfileImage() {

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Upload your profile photo',
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

          let profileImageData = {
            profile: {
              id: this.userProfile.id
            },
            body: null,
            extension: "jpg"
          };

          toDataURL(imageData)
            .then(dataUrl => {
              let image = dataUrl.toString();
              image = image.replace('data:;base64,', '');

              profileImageData.body = image;

              const loading = this.loadingCtrl.create({
                spinner: 'hide',
                content: `
                    <div class="custom-spinner-container">
                      <img src="assets/customSpinner.svg">
                    </div>`
              });
              loading.present();

              this.profileService.uploadImage(profileImageData).subscribe(
                (responseProfileImage) => {
                  loading.dismiss();
                  //load all tha data of the page again
                  this.loadData();

                  let toast = this.toastCtrl.create({
                    message: 'Your profile image was updated!',
                    duration: 3000
                  });
                  toast.present();
                },
                (errorsProfileImage) => {
                  loading.dismiss();
                  this.handleError(errorsProfileImage);
                }
              );

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

      let image = imageData;
      //image = 'data:image/jpeg;base64,' + image;

      let profileImageData = {
        profile: {
          id: this.userProfile.id
        },
        body: image,
        extension: "jpg"
      };

      const loading = this.loadingCtrl.create({
        spinner: 'hide',
        content: `
      <div class="custom-spinner-container">
        <img src="assets/customSpinner.svg">
      </div>`
      });
      loading.present();

      this.profileService.uploadImage(profileImageData).subscribe(
        (responseProfileImage) => {
          loading.dismiss();

          //load all tha data of the page again
          this.loadData();

          let toast = this.toastCtrl.create({
            message: 'Your profile image was updated!',
            duration: 3000
          });
          toast.present();
        },
        (errorsProfileImage) => {
          loading.dismiss();
          this.handleError(errorsProfileImage);
        }
      );

    }, (err) => {
      console.log(err);
    });
  }

  isApprovedPractitioner(profile): boolean {
    return (
      profile.is_practitioner
      && profile.hasOwnProperty('practitioner_account')
      && profile.practitioner_account.approved
    );
  }


  private handleError(errors: any) {
    let errorMessage = '';
    for (let error of errors) {
      if (error.message == 'something' && error.code == '401') {
        errorMessage += '<p>This is a custom error.</p>';
      } else {
        errorMessage += '<p>' + error.message + "</p>";
      }
    }

    const alert = this.alertCtrl.create({
      title: 'An error occurred!',
      message: errorMessage,
      buttons: ['Ok']
    });
    alert.present();
  }

}