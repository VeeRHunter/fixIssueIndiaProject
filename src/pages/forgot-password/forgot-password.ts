import {Component} from '@angular/core';
import {IonicPage, NavController, AlertController, LoadingController} from 'ionic-angular';
import {Register} from "../register/register";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {Http} from "@angular/http";
import {PasswordReset} from "./password-reset/password-reset";
import {TabsPage} from "../tabs/tabs";
import {AuthenticationService} from "../../service/authentication";
import {Facebook, FacebookLoginResponse} from "@ionic-native/facebook";
import {GooglePlus} from '@ionic-native/google-plus';
import {UserService} from "../../service/user";
import {Device} from '@ionic-native/device';

@IonicPage({name: "forgot-password", segment: "forgot-password" })
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPassword {

  public data: any = {};
  public errors: any = [];

  constructor(public navCtrl: NavController,
              private authenticationService: AuthenticationService,
              private facebook: Facebook,
              private googlePlus: GooglePlus,
              private userService: UserService,
              private http: Http,
              private device: Device,
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController) {
  }

  public resetFormValues(): void {
    this.data.email_address = null;
  }

  public onForgotPassword(): void {
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

    this.postResetPassword(this.data).subscribe(
      (response) => {
        loading.dismiss();

        const alert = this.alertCtrl.create({
          title: 'Resetting password',
          message: 'An email with instruction to reset password has been sent',
          buttons: [{
            text: 'Ok',
            handler: () => {
              let params = {email: this.data.email_address};
              this.navCtrl.setRoot(PasswordReset, params);
            }
          }]
        });
        alert.present();

        console.log(response);
      },
      (errors) => {
        loading.dismiss();
        let errorMessage = '';

        for (let error of errors) {
          errorMessage += '<p>' + error.message + "</p>";
        }

        const alert = this.alertCtrl.create({
          title: 'Resetting password failed',
          message: errorMessage,
          buttons: ['Ok']
        });
        alert.present();

        this.errors = errors;
      }
    )

  }

  public postResetPassword(postObject: any): Observable < any > {
    let baseApi = environment.api_host;

    return Observable.create((observer) => {
      this.http.post(`${baseApi}/reset-password/`, JSON.stringify(postObject)).subscribe(
        (response) => observer.next(response.json().data),
        (error) => observer.error(error.json().errors)
      );
    });
  }

  validate() {
    if (this.data.email_address && this.isValidEmail(this.data.email_address)) {
      this.onForgotPassword();
      return;
    }

    const alert = this.alertCtrl.create({
      title: 'Validation error',
      message: 'Please enter a valid email address',
      buttons: ['Ok']
    });
    alert.present();
  }

  private isValidEmail(email) {
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  onRegister() {
    this.navCtrl.push(Register);
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