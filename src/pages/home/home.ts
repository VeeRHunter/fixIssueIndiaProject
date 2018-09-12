import {Component} from "@angular/core";
import {Events, NavController} from "ionic-angular";
import {Login} from "../login/login";
import {Register} from "../register/register";
import {AuthenticationService} from "../../service/authentication";
import {OnboardingService} from "../../service/onboarding";
import {OnboardingPage} from "../onboarding/onboarding";
import {Facebook, FacebookLoginResponse} from "@ionic-native/facebook";
import {GooglePlus} from '@ionic-native/google-plus';
import {Device} from '@ionic-native/device';
import {TabsPage} from "../tabs/tabs";
import {UserService} from "../../service/user";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  userData: any;

  constructor(public navCtrl: NavController,
              private authService: AuthenticationService,
              private facebook: Facebook,
              private googlePlus: GooglePlus,
              private device: Device,
              private userService: UserService,
              public events: Events) {
  }

  //noinspection JSUnusedGlobalSymbols
  public ionViewDidLoad(): void {
    if (!OnboardingService.userHasCompletedTutorial()) {
      this.navCtrl.push(OnboardingPage);
    }
  }

  onLogin() {
    this.navCtrl.push(Login);
  }

  onRegister() {
    this.navCtrl.push(Register);
  }

  onLogout() {
    this.authService.logout();
    this.navCtrl.setRoot(HomePage);
  }

  //702117810573-7g6r1l9csbel6iqoflaskvatujq9aaol.apps.googleusercontent.com
  //com.googleusercontent.apps.702117810573-7g6r1l9csbel6iqoflaskvatujq9aaol

  loginWithFB() {
    this.facebook.login(['email', 'public_profile']).then((response: FacebookLoginResponse) => {

      this.authService.authenticateWithFacebook({access_token: response.authResponse.accessToken}).subscribe(
        (response) => {
          this.afterAuthentication(response);
        },
        (errors) => {
          console.log(errors);
        });

    });
  }

  //Other:   com.googleusercontent.apps.702117810573-7g6r1l9csbel6iqoflaskvatujq9aaol
  //IOS:     com.googleusercontent.apps.702117810573-rri3u6o8daubpljpf38aj3bki25tkrvi
  //Android: 702117810573-jjphf95s7637ktaj1haggc8gd58trnqc.apps.googleusercontent.com

  loginWithGoogle() {
    this.googlePlus.login({
      // 'webClientId': '<Your web client ID>',
      // 'offline': true
    }).then(profile => {

      this.authService.authenticateWithGoogle({
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

    this.authService.storeAuthentication(profile);

    setTimeout(function() {
      self.userService.getCurrentUser().subscribe(
        (user) => {
          self.authService.storeUser(user);

          // self.notificationService.countNotifications().subscribe(
          //   (responseCountNotification) => {
          //     // inject notifications
          //     user.notifications = responseCountNotification;
          //     setTimeout(() => {
          //       self.authService.storeUser(user);
          //     }, 200);
          //
          //     self.events.publish('notification:counter:updated', responseCountNotification);
          //   },
          //   (errorCountNotification) => {
          //     console.log(errorCountNotification);
          //   }
          // );
          self.navCtrl.setRoot(TabsPage);
        },
        (errors) => {
          console.log(errors);
          this.navCtrl.push(Login);
          self.navCtrl.setRoot(Login);
        }
      );
    }, 200);

  }

}
