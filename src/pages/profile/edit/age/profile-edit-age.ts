import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, AlertController} from 'ionic-angular';
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {Profile} from "../../../../models/profile";
import {ProfileService} from "../../../../service/profile";

@IonicPage({name: "profile-edit-age", segment: "profile-edit-age" })
@Component({
  selector: 'page-profile-edit-age',
  templateUrl: 'profile-edit-age.html',
})
export class ProfileEditAge {

  dataLoading: boolean = false;
  profileForm: FormGroup;
  profile: Profile;
  days: any = [];
  months: any = [];
  years: any = [];
  day: any;
  year: any;
  month: any;

  constructor(private navCtrl: NavController,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private navParams: NavParams,
              private profileService: ProfileService) {

    this.profile = this.navParams.get('profile');

    this.profileForm = new FormGroup({
      'date_of_birth': new FormControl(this.profile.date_of_birth, Validators.required),
    });

    let dateOfBirth = new Date(this.profile.date_of_birth);
    this.day = dateOfBirth.getDate();
    this.year = dateOfBirth.getFullYear();
    this.month = dateOfBirth.getMonth() + 1;
    if (this.day < 10) {
      this.day = '0' + this.day;
    }
    if (this.month < 10) {
      this.month = '0' + this.month;
    }

    for (let i = new Date().getFullYear() - 100; i <= new Date().getFullYear(); i++) {
      this.years.push(i);
    }
    this.months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    this.days = [
      '01', '02', '03', '04', '05', '06', '07', '08', '09', '10',
      '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
      '21', '22', '23', '24', '25', '26', '27', '28', '29', '30',
      '31'
    ];
  }

  goBackPage() {
    this.navCtrl.pop();
  }

  onSubmit() {

    if (!this.year || !this.month || !this.day) {
      const alert = this.alertCtrl.create({
        title: 'An error occurred!',
        message: 'Please select Year, Month and Day',
        buttons: ['Ok']
      });
      alert.present();
      return;
    }

    const loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `
      <div class="custom-spinner-container">
        <img src="assets/customSpinner.svg">
      </div>`
    });
    loading.present();

    let profileData = {
      first_name: this.profile.first_name,
      last_name: this.profile.last_name,
      gender: this.profile.gender,
      date_of_birth: this.year + '-' + this.month + '-' + this.day,
      city: this.profile.city,
      country: this.profile.country
    };

    this.profileService.updateOne(this.profile.id, profileData).subscribe(
      (response) => {
        this.dataLoading = false;
        loading.dismiss();

        this.navCtrl.pop();
      },
      (errors) => {
        console.log(errors);
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
