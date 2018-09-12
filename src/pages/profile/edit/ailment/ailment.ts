import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, AlertController} from 'ionic-angular';
import {Profile} from "../../../../models/profile";
import {AilmentCategoryService} from "../../../../service/ailment-category";
import {ProfileService} from "../../../../service/profile";

@IonicPage({name: "profile-edit-ailment", segment: "profile-edit-ailment" })
@Component({
  selector: 'page-profile-edit-ailment',
  templateUrl: 'ailment.html',
})
export class ProfileEditAilment {

  public dataLoading: boolean = false;
  public data: any = {
    password: null,
    passwordNew: null,
    passwordNewRepeat: null,
  };
  public errors: any = [];
  public profile: Profile;
  public ailmentCategories: any;
  public ailmentId: any;

  constructor(private navCtrl: NavController,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private navParams: NavParams,
              private ailmentService: AilmentCategoryService,
              private profileService: ProfileService) {

    this.profile = this.navParams.get('profile');
    this.ailmentId = (this.profile.ailment_category) ? this.profile.ailment_category.id : null;
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

    this.ailmentService.getAllRaw().subscribe(
      (ailmentCategories) => {
        this.ailmentCategories = ailmentCategories;

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

  onSubmit(index) {
    this.ailmentId = index;

    const loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `
      <div class="custom-spinner-container">
        <img src="assets/customSpinner.svg">
      </div>`
    });
    loading.present();

    if (this.profile.ailment_category) {
      this.profile.ailment_category.id = this.ailmentId;
    } else {
      this.profile.ailment_category = {
        id: this.ailmentId
      };
    }
    delete this.profile.ailment_category.field_of_practice;
    delete this.profile.ailment_category.name;

    this.profileService.updateOne(this.profile.id, this.profile).subscribe(
      (response) => {
        this.dataLoading = false;
        loading.dismiss();
      },
      (errors) => {
        this.dataLoading = false;
        loading.dismiss();
        this.handleError(errors);
      }
    );

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
