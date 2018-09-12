import {Component} from '@angular/core';
import {IonicPage, NavController, AlertController, NavParams} from 'ionic-angular';
import {Profile as ProfileModel} from "../../models/profile";
import {ShareService} from "../../service/share";

@IonicPage({name: "share", segment: "share"})
@Component({
  selector: 'page-share',
  templateUrl: 'share.html',
})
export class Share {

  public email: string;
  public profile: ProfileModel;

  constructor(private navParams: NavParams,
              private alertCtrl: AlertController,
              private navCtrl: NavController,
              private shareService: ShareService) {
    this.profile = this.navParams.get('profile');
  }

  loadData() {
  }

  goBackPage() {
    this.navCtrl.pop();
  }

  public onSubmit() {

    if (!this.isValidEmail(this.email)) {
      const alert = this.alertCtrl.create({
        message: 'You must enter a valid email',
        buttons: ['Ok']
      });
      alert.present();
    } else {
      this.shareService.shareByEmail(this.email).subscribe(
        (res) => {
          const alert = this.alertCtrl.create({
            message: 'Your Invitation to Use the Onus App has Been Sent',
            buttons: ['Ok']
          });
          alert.present();
          this.email = '';
        },
        (errors) => {
          console.log(errors);
          this.goBackPage();
        }
      );
    }
  }

  private isValidEmail(email) {
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
}