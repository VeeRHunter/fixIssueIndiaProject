import {Component} from '@angular/core';
import {IonicPage, NavController, AlertController, LoadingController, NavParams} from 'ionic-angular';
import {Register} from "../../register/register";
import {HomePage} from "../../home/home";
import {PasswordResetService} from "../../../service/password-reset";

@IonicPage({name: "password-reset", segment: "password-reset" })
@Component({
  selector: 'page-password-reset',
  templateUrl: 'password-reset.html',
})
export class PasswordReset {

  // public pincode: any = null;
  public in1: any = null;
  public in2: any = null;
  public in3: any = null;
  public in4: any = null;
  public in5: any = null;
  public in6: any = null;

  public data: any = {
    email: null,
    pincode: null,
    plain_password: null,
    confirmation_plain_password: null,
  };
  public errors: any = [];
  public step: string = 'step_pincode';

  constructor(public navCtrl: NavController,
              private navParams: NavParams,
              private passwordResetService: PasswordResetService,
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController) {

    this.data.email = this.navParams.get("email");
  }


  public onPasswordReset(): void {
    const loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `
      <div class="custom-spinner-container">
        <img src="assets/customSpinner.svg">
      </div>`
    });
    loading.present();

    this.passwordResetService.performResetPasswordWithPincode(this.data).subscribe(
      (response) => {
        console.log(response);

        loading.dismiss();

        const alert = this.alertCtrl.create({
          title: 'Password changed',
          message: 'The password was successfully changed. Please sign in...',
          buttons: [{
            text: 'Ok',
            handler: () => {
              this.navCtrl.setRoot(HomePage);
            }
          }]
        });
        alert.present();
      },
      (errors) => {
        loading.dismiss();
        let errorMessage = '';

        for (let error of errors) {
          if (error.message == 'To be developed') {
            errorMessage += '<p>Custom error message</p>';
          } else {
            errorMessage += '<p>' + error.message + "</p>";
          }
        }

        const alert = this.alertCtrl.create({
          title: 'Change password failed',
          message: errorMessage,
          buttons: [{
            text: 'Ok',
            handler: () => {
              this.navCtrl.setRoot(HomePage);
            }
          }]
        });
        alert.present();

        this.errors = errors;
      }
    )

  }

  validate(value: string) {
    if ('step_password' === value) {

      if (null === this.data.pincode || 6 != this.data.pincode.length) {
        const alert = this.alertCtrl.create({
          title: 'Validation error',
          message: 'Please enter a valid pincode',
          buttons: ['Ok']
        });
        alert.present();
      }

      this.step = 'step_password';

    } else if ('step_password_confirmation' === value) {

      if (null === this.data.plain_password) {
        const alert = this.alertCtrl.create({
          title: 'Validation error',
          message: 'Please enter a valid password',
          buttons: ['Ok']
        });
        alert.present();
      }

      this.step = 'step_password_confirmation';

    } else if ('step_submit' === value) {
      if (this.data.plain_password !== this.data.confirmation_plain_password) {
        const alert = this.alertCtrl.create({
          title: 'Validation error',
          message: 'Password and password confirmation does not match',
          buttons: ['Ok']
        });
        alert.present();
      } else {

        this.onPasswordReset();
        return;
      }
    }

  }

  onRegister() {
    this.navCtrl.push(Register);
  }

  // onSubmit() {
  //   this.validate('step_password');
  // }

  onPinChange() {
    this.data.pincode = this.in1 + this.in2 + this.in3 + this.in4 + this.in5 + this.in6;
    if (6 == this.data.pincode.length) {
      this.validate('step_password');
    }
  }

  public onPinClick(inVal: string) {

    switch (inVal) {
      case 'in1':
        this.in1 = null;
        break;
      case 'in2':
        this.in2 = null;
        break;
      case 'in3':
        this.in3 = null;
        break;
      case 'in4':
        this.in4 = null;
        break;
      case 'in5':
        this.in5 = null;
        break;
      case 'in6':
        this.in6 = null;
        break;

    }
  }

}