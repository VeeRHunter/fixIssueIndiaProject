import {Component} from '@angular/core';
import {IonicPage, NavController, AlertController, LoadingController, Events} from 'ionic-angular';
import {AuthenticationService} from "../../service/authentication";
import {UserService} from "../../service/user";
import {TabsPage} from "../tabs/tabs";
import {Register} from "../register/register";
import {ForgotPassword} from "../forgot-password/forgot-password";
import { Device } from '@ionic-native/device';
import {Facebook, FacebookLoginResponse} from "@ionic-native/facebook";
import {GooglePlus} from '@ionic-native/google-plus';

@IonicPage({name: "login", segment: "login" })
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class Login {

  public data: any = {};
  public errors: any = [];
  public step: string = 'step_username';

  constructor(public navCtrl: NavController,
              private device: Device,
              private authenticationService: AuthenticationService,
              private userService: UserService,
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController,
              private facebook: Facebook,
              private googlePlus: GooglePlus,
              public events: Events) {
  }

  public resetFormValues(): void {
    this.data.username = null;
    this.data.password = null;
  }

  public attemptAuthentication(): void {
    const loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `
      <div class="custom-spinner-container">
        <img src="assets/customSpinner.svg">
      </div>`
    });
    loading.present();

    this.data.device_name =
      this.device.cordova + ',' +
      this.device.model + ',' +
      this.device.platform + ',' +
      this.device.version + ',' +
      this.device.manufacturer
    ;

    this.authenticationService.authenticate(this.data).subscribe(
      (response) => {
        loading.dismiss();
        this.authenticationService.storeAuthentication(response);
        this.userService.getCurrentUser().subscribe(
          (user) => {
            //this.notificationService.triggerNotificationCount();
            this.authenticationService.storeUser(user);

            this.navCtrl.setRoot(TabsPage);
          },
          (errors) => {
            console.log(errors);
            this.resetFormValues();
            this.errors = errors;
          }
        );
      },
      (errors) => {
        loading.dismiss();
        let errorMessage = '';

        if (errors) {
          for (let error of errors) {
            if (error.message == 'Authentication problem' && error.code == '401') {
              errorMessage += '<p>We do not find a valid username and password combination.</p>';
              errorMessage += '<p>Please try again</p>';
            } else if (error.message == 'User blocked') {
              errorMessage += '<p>' + error.message + '</p>';
              errorMessage += '<p>For reactivation please contact hello@onusapp.net</p>';
            } else {
              errorMessage += '<p>' + error.message + "</p>";
              errorMessage += '<p>Please try again</p>';
            }
          }
        } else {
          errorMessage = 'Unknown error';
          errorMessage += '<p>Please try again</p>';
        }


        const alert = this.alertCtrl.create({
          title: 'Signin failed',
          message: errorMessage,
          buttons: ['Ok']
        });
        alert.present();

        this.resetFormValues();
        this.errors = errors;
        this.step = 'step_username';
      }
    );
  }

  validate(value: string) {
    if (value == 'username') {
      if (this.data.username) {
        this.step = 'step_password';
      }
    } else if (value == 'password') {
      if (this.data.password) {
        this.attemptAuthentication();
      }
    }
  }

  onRegister() {
    this.navCtrl.push(Register);
  }

  onForgotPassword() {
    this.navCtrl.push(ForgotPassword);
  }

  loginWithFB() {
    this.facebook.login(['email', 'public_profile']).then((response: FacebookLoginResponse) => {

      this.authenticationService.authenticateWithFacebook({access_token: response.authResponse.accessToken}).subscribe(
        (response) => {
          this.afterAuthentication(response);
        },
        (errors) => {
          console.log(errors);
        });

    });
  }

  loginWithGoogle() {
    this.googlePlus.login({
    }).then(profile => {

      this.authenticationService.authenticateWithGoogle({
        image_url: profile['imageUrl'],
        email: profile['email'],
        given_name: profile['givenName'],
        family_name: profile['familyName'],
        device_name: this.device.cordova + ',' +
        this.device.model + ',' +
        this.device.platform + ',' +
        this.device.version + ',' +
        this.device.manufacturer
      }).subscribe(
        (response) => {
          this.afterAuthentication(response);
        },
        (errors) => {
          console.log(errors);
        });

    })
      .catch(err => console.error(err));
  }

  afterAuthentication(profile) {
    let self = this;

    this.authenticationService.storeAuthentication(profile);

    setTimeout(function() {
      self.userService.getCurrentUser().subscribe(
        (user) => {
          self.authenticationService.storeUser(user);
          self.navCtrl.setRoot(TabsPage);
        },
        (errors) => {
          console.log(errors);
        }
      );
    }, 200);

  }

}