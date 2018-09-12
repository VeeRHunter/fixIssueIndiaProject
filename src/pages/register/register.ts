import {Component} from '@angular/core';
import {IonicPage, NavController, AlertController, ModalController, LoadingController} from 'ionic-angular';
import {Observable} from "rxjs";
import {Http} from "@angular/http";
import {environment} from "../../environments/environment";
import {Terms} from "../terms/terms";
import {ProfileCreateService} from "../../service/profileCreate";
import {TabsPage} from "../tabs/tabs";
import {AuthenticationService} from "../../service/authentication";
import {UserService} from "../../service/user";
import {Device} from '@ionic-native/device';

@IonicPage({name: "register", segment: "register" })
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class Register {

  constructor(private navCtrl: NavController,
              private http: Http,
              private alertCtrl: AlertController,
              private modalCtrl: ModalController,
              private profileCreateService: ProfileCreateService,
              private device: Device,
              private authenticationService: AuthenticationService,
              private userService: UserService,
              private loadingCtrl: LoadingController) {
  }

  public userRegistration: any = {};
  public step: string = 'step_first_name';
  public step_previous: string = null;
  public step_next: string = 'step_last_name';

  public isFirstNameValid = null;
  public isLastNameValid = null;
  public isEmailValid = null;
  public isEmailRepeatValid = null;
  public isPasswordValid = null;
  public isPasswordRepeatValid = null;

  public errors: any = [];
  public submitButtonDisabled: boolean = false;

  public backgroundImage = "url('assets/background/NAME-BG@3x.png')";
  public registerLabelText: string = "Let's start with your first name";
  public canDisplayTermsConfirmationMessage = false;

  displayTermsFooterMessage() {
    return (this.step == 'step_password' || this.step == 'step_password_repeat');
  }

  setBackgroundImage() {
    switch (this.step) {
      case 'step_first_name':
      case 'step_last_name':
        this.backgroundImage = "url('assets/background/NAME-BG@3x.png')";
        break;
      case 'step_email':
      case 'step_email_repeat':
        this.backgroundImage = "url('assets/background/email-and-explore-BG@3x.png')";
        break;

      case 'step_password':
      case 'step_password_repeat':
        this.backgroundImage = "url('assets/background/password-BG@3x.png')";
        break;
    }
  }

  onRegister() {
    this.submitButtonDisabled = true;
    const loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `
      <div class="custom-spinner-container">
        <img src="assets/customSpinner.svg">
      </div>`
    });
    loading.present();

    let userCreation = {
      // first_name: this.userRegistration.first_name,
      // last_name: this.userRegistration.last_name,
      email_address: this.userRegistration.email,
      user: {
        username: this.getUsername(this.userRegistration.email),
        plain_password: this.userRegistration.password
      }
    };

    //create a profile linked to user
    this.postUserCreate(userCreation).subscribe(
      (user) => {
        let profile = {
          first_name: this.userRegistration.first_name,
          last_name: this.userRegistration.last_name,
          user: {
            id: user.id
          }
        };

        //create profile
        this.profileCreateService.createProfile(profile).subscribe(
          (responseProfile) => {
            let device_name =
              this.device.cordova + ',' +
              this.device.model + ',' +
              this.device.platform + ',' +
              this.device.version + ',' +
              this.device.manufacturer
            ;

            let loginData = {
              username: userCreation.user.username,
              password: userCreation.user.plain_password,
              device_name: device_name
            };

            this.authenticationService.authenticate(loginData).subscribe(
              (response) => {
                loading.dismiss();
                this.authenticationService.storeAuthentication(response);
                this.userService.getCurrentUser().subscribe(
                  (user) => {
                    //this.notificationService.triggerNotificationCount();

                    this.navCtrl.setRoot(TabsPage);
                  },
                  (errors) => {
                    console.log(errors);
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
              }
            );

          },
          (errors) => {
            loading.dismiss();
            const alert = this.alertCtrl.create({
              title: 'Profile creation failed',
              message: 'Please try again',
              buttons: ['Ok']
            });
            alert.present();
          })
        ;

      },
      (errors) => {
        this.submitButtonDisabled = false;

        loading.dismiss();
        const alert = this.alertCtrl.create({
          title: 'Account creation failed',
          message: 'It seems that the email address is already used. Please try another one.',
          buttons: ['Ok']
        });
        alert.present();
      }
    )
  }

  private getUsername(email) {
    return email;
    // let parts: string[] = email.split("@");
    // console.log(parts);
    // return parts[0];
  }

  public postUserCreate(user: any): Observable < any > {
    let baseApi = environment.api_host;

    return Observable.create((observer) => {
      this.http.post(`${baseApi}/user/`, JSON.stringify(user)).subscribe(
        (response) => observer.next(response.json().data),
        (error) => observer.error(error.json().errors)
      );
    });
  }

  public validate(item: string) {
    this.isFirstNameValid = (this.userRegistration.first_name) ? true : false;
    this.isLastNameValid = (this.userRegistration.last_name) ? true : false;
    this.isEmailValid = (this.isValidEmail(this.userRegistration.email)) ? true : false;
    this.isEmailRepeatValid = (this.userRegistration.email_repeat == this.userRegistration.email) ? true : false;
    this.isPasswordValid = this.isValidPassword(this.userRegistration.password);
    this.isPasswordRepeatValid = (this.userRegistration.password_repeat && this.userRegistration.password_repeat == this.userRegistration.password) ? true : false;
  }

  eventHandler(keyCode, isValidCondition) {
    let self = this;
    self.validate('');
      if (isValidCondition && keyCode === 13) {
        if (self.isPasswordRepeatValid) {
          self.displayTermsConfirmationMessage();
        } else {
          self.goToStep(self.step_next);
        }
      }
  }

  private isValidEmail(email) {
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  private isValidPassword(pass) {
    if (pass) {
      let pass = this.userRegistration.password;
      let passLen = pass.length;
      if (passLen > 5) {
        return true;
      }
    }
    return false;
  }

  goToStep(step: string) {
    this.step = step;
    this.setBackgroundImage();
    this.canDisplayTermsConfirmationMessage = false;

    switch (this.step) {
      case 'step_first_name':
        this.step_previous = null;
        this.step_next = 'step_last_name';
        this.registerLabelText = "Let's start with your last name";
        break;
      case 'step_last_name':
        this.step_previous = 'step_first_name';
        this.step_next = 'step_email';
        this.registerLabelText = "What's your last name?";
        break;
      case 'step_email':
        this.step_previous = 'step_last_name';
        this.step_next = 'step_email_repeat';
        this.registerLabelText = "What's your email address?";
        break;
      case 'step_email_repeat':
        this.step_previous = 'step_email';
        this.step_next = 'step_password';
        this.registerLabelText = "Please verify your email";
        break;
      case 'step_password':
        this.step_previous = 'step_email_repeat';
        this.step_next = 'step_password_repeat';
        this.registerLabelText = "Chose a safe password";
        break;
      case 'step_password_repeat':
        this.step_previous = 'step_password';
        this.step_next = null;
        this.registerLabelText = "Please verify your password";
        break;
    }
  }

  goBackPage() {
    this.navCtrl.pop();
  }

  displayTerms() {
    let termsModal = this.modalCtrl.create(Terms);
    termsModal.present();
  }

  displayTermsConfirmationMessage() {
    this.canDisplayTermsConfirmationMessage = true;
    this.registerLabelText = " ";
  }

  onTermsAgreeNo() {
    const alert = this.alertCtrl.create({
      message: 'You must agree to the Terms & Conditions to Sign Up',
      buttons: ['Ok']
    });
    alert.present();
  }

}