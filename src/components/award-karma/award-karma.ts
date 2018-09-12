import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Profile as ProfileModel} from "../../models/profile";
import {LoadingController, AlertController, FabContainer} from "ionic-angular";
import {KarmaPointService} from "../../service/karma-point";

@Component({
  selector: 'award-karma',
  templateUrl: 'award-karma.html'
})
export class AwardKarmaComponent {

  @Input() post: any;
  @Input() userProfile: any;
  @Input() karmaBarPosition: string = 'top';
  text: string;
  public timeDifference: string;

  @Output() isReloadNeeded = new EventEmitter();

  constructor(private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private karmaPointService: KarmaPointService) {
  }

  ngAfterViewInit() {
  }

  getUserProfileImage(profile: ProfileModel) {
    let profileImage = 'assets/images/no-person-image.jpg';

    if (profile.hasOwnProperty('profile_image') && profile.profile_image.small_url != null) {
      profileImage = profile.profile_image.small_url;
    }

    return profileImage;
  }

  public onAddKarmaPoint(points: number, fab: FabContainer) {

    let data = {
      awarding_profile: {
        id: this.userProfile.id
      },
      target_profile: {
        id: this.post.post.profile.id
      },
      post: {
        id: this.post.post.id
      },
      points_awarded: points,
    };
    const loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `
      <div class="custom-spinner-container">
        <img src="assets/customSpinner.svg">
      </div>`
    });
    loading.present();

    this.karmaPointService.createOne(data).subscribe(
      (response) => {
        loading.dismiss();
        this.post.post.total_karma_points += points;
        this.post.awarded_karma_points = points;
        this.post.awarded_karma_id = response.id;
        fab.close();
      },
      (errors) => {
        loading.dismiss();
        this.handleError(errors);
      }
    );
  }

  public onUpdateKarmaPoint(points: number, fab: FabContainer) {

    let data = {
      points_awarded: points,
    };

    const loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `
      <div class="custom-spinner-container">
        <img src="assets/customSpinner.svg">
      </div>`
    });
    loading.present();

    this.karmaPointService.updateOne(this.post.awarded_karma_id, data).subscribe(
      (response) => {
        loading.dismiss();
        this.post.post.total_karma_points = response.post.total_karma_points;
        this.post.awarded_karma_points = points;
        this.post.awarded_karma_id = response.id;
        fab.close();
      },
      (errors) => {
        loading.dismiss();
        this.handleError(errors);
      }
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
