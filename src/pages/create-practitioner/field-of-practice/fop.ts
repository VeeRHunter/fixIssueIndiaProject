import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, AlertController} from 'ionic-angular';
import {FieldOfPracticeService} from "../../../service/field-of-practice";
import {Profile} from "../../../models/profile";

@IonicPage({name: "profile-field-of-practice", segment: "profile-field-of-practice" })
@Component({
  selector: 'page-fop',
  templateUrl: 'fop.html',
})
export class FOP {

  public dataLoading: boolean = false;
  public data: any = {
    password: null,
    passwordNew: null,
    passwordNewRepeat: null,
  };
  public errors: any = [];
  public profile: Profile;
  public fop: any;
  public fopId: any;
  public callback: any;

  constructor(private navCtrl: NavController,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private navParams: NavParams,
              private fopService: FieldOfPracticeService) {

    this.profile = this.navParams.get('profile');
    this.callback = this.navParams.get('callback');

    this.fopId = (this.profile.practitioner_account && this.profile.practitioner_account.field_of_practice) ? this.profile.practitioner_account.field_of_practice.id: null;
  }

  ionViewWillEnter() {
    this.loadData();
  }

  loadData() {
    this.dataLoading = true;
    const loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `
      <div class="custom-spinner-container">
        <img src="assets/customSpinner.svg">
      </div>`
    });
    loading.present();

    this.fopService.getAllRaw().subscribe(
      (fop) => {
        this.fop = fop;

        this.dataLoading = false;
        loading.dismiss();
      },
      (errors) => {
        loading.dismiss();
        this.handleError(errors);
      }
    );

  }

  goBackPage() {
    this.navCtrl.pop();
  }

  onSubmit(index, name) {

    this.callback({fopId: index, fopName: name}).then(()=>{
      this.navCtrl.pop();
    });

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
