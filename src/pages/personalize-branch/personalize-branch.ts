import {Component} from '@angular/core';
import {IonicPage, App, NavController, NavParams, AlertController, ModalController} from 'ionic-angular';
import {HomePage} from "../home/home";
import {AuthenticationService} from "../../service/authentication";
import {ProfileEdit} from "../profile/edit/profile-edit";
import {Profile} from "../../models/profile";
import {NotificationService} from "../../service/notification";
import {Share} from "../share/share";
import {Terms} from "../terms/terms";

@IonicPage({name: "personalize-branch", segment: "personalize-branch"})
@Component({
  selector: 'page-personalize-branch',
  templateUrl: 'personalize-branch.html',
})
export class PersonalizeBranch {

  public profile: Profile;

  constructor(private authService: AuthenticationService,
              private navCtrl: NavController,
              private navParams: NavParams,
              private app: App,
              private notificationService: NotificationService,
              private modalCtrl: ModalController,
              private alertCtrl: AlertController) {
    this.profile = this.navParams.get('profile');
  }

  ionViewWillEnter() {
    this.loadData();
  }

  loadData() {
    this.notificationService.triggerNotificationCount().subscribe(
      (count) => console.log(count)
    );
  }

  onLogout() {
    let confirm = this.alertCtrl.create({
      title: 'Log out',
      message: 'Would you like to Log out of the Application?',
      buttons: [
        {
          text: 'no',
          handler: () => {
          }
        },
        {
          text: 'yes',
          handler: () => {
            this.authService.logout();
            this.app.getRootNav().setRoot(HomePage);
          }
        }
      ]
    });
    confirm.present();

  }

  goBackPage() {
    this.navCtrl.pop();
  }

  onSettings() {
    this.navCtrl.push(ProfileEdit);
  }

  onCreatePractitioner() {
    const alert = this.alertCtrl.create({
      title: 'This feature is coming soon',
      buttons: ['Ok']
    });
    alert.present();

    // this.navCtrl.push(CreatePractitioner, {
    //   profile: this.profile
    // });
  }

  onShareApp() {
    this.navCtrl.push(Share, {
      profile: this.profile
    });
  }

  displayTerms() {
    let termsModal = this.modalCtrl.create(Terms);
    termsModal.present();
  }

}