import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, AlertController} from 'ionic-angular';
import {Profile} from "../../../../models/profile";
import {UserService} from "../../../../service/user";
import {AuthenticationService} from "../../../../service/authentication";

@IonicPage({name: "profile-edit-change-password", segment: "profile-edit-change-password" })
@Component({
  selector: 'page-profile-edit-change-password',
  templateUrl: 'change-password.html',
})
export class ProfileEditChangePassword {

  public dataLoading: boolean = false;
  public data: any = {
    password: null,
    passwordNew: null,
    passwordNewRepeat: null,
  };
  public errors: any = [];
  public profile: Profile;

  constructor(private navCtrl: NavController,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private authService: AuthenticationService,
              private userService: UserService,
              private navParams: NavParams) {

    this.profile = this.navParams.get('profile');
  }

  goBackPage() {
    this.navCtrl.pop();
  }

  onSubmit() {

    let error = false;
    let errorMessage = '';

    if (!this.data.password) {
      error = true;
      errorMessage = 'Please fill current password';
    }
    if (!this.data.passwordNew) {
      error = true;
      errorMessage = 'Please fill new password';
    }
    if (this.data.passwordNew != this.data.passwordNewRepeat) {
      error = true;
      errorMessage = 'Password confirmation does not match with new password';
    }

    if (error) {
      const alert = this.alertCtrl.create({
        title: 'Validation error',
        message: errorMessage,
        buttons: ['Ok']
      });
      alert.present();
    } else {
      const loading = this.loadingCtrl.create({
        spinner: 'hide',
        content: `
      <div class="custom-spinner-container">
        <img src="assets/customSpinner.svg">
      </div>`
      });
      loading.present();
      this.userService.updateCurrentPassword(
        this.data.password,
        this.data.passwordNew,
        this.data.passwordNewRepeat
      ).subscribe(
        (data) => {
          this.authService.removeUserCredentials();
          this.goBackPage();
          loading.dismiss();
        },
        (errors) => {
          this.dataLoading = false;
          this.handleError(errors);
          loading.dismiss();
        }
      );
    }
  }

  private handleError(errors: any) {
    let errorMessage = '';
    for (let error of errors) {
      errorMessage += '<p>' + error.message + "</p>";
    }

    const alert = this.alertCtrl.create({
      title: 'An error occurred!',
      message: errorMessage,
      buttons: ['Ok']
    });
    alert.present();
  }
}
