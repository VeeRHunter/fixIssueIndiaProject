import {Component, OnInit} from '@angular/core';
import {IonicPage, AlertController, LoadingController, NavController} from 'ionic-angular';
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {ProfileService} from "../../../service/profile";
import {Camera} from "ionic-native";
import {Profile} from "../../../models/profile";
import {ProfileEditAge} from "./age/profile-edit-age";
import {ProfileEditLocation} from "./location/profile-edit-location";
import {ProfileEditChangePassword} from "./change-password/change-password";
import {ProfileEditAilment} from "./ailment/ailment";
import {ProfilePrivacy} from "../../profile-privacy/profile-privacy";

@IonicPage({name: "profile-edit", segment: "profile-edit"})
@Component({
  selector: 'page-profile-edit',
  templateUrl: 'profile-edit.html',
})
export class ProfileEdit implements OnInit {

  profileForm: FormGroup;
  public dataLoading: boolean = true;
  public userProfile: Profile = null;
  public countries: any = [];
  public cities: any = [];
  public errors: any = [];
  public imageUrl: any = false;
  public base64Image: string;
  public overlayGender: boolean = false;

  public GENDER_MALE = 0;
  public GENDER_FEMALE = 1;
  public GENDER_INDETERMINATE = 2;
  public GENDER_INTERSEX = 3;
  public GENDER_OTHER = 4;

  public genderValue = {};

  constructor(private profileService: ProfileService,
              private navCtrl: NavController,
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController) {

    this.genderValue[this.GENDER_MALE] = 'Male';
    this.genderValue[this.GENDER_FEMALE] = 'Female';
    this.genderValue[this.GENDER_INDETERMINATE] = 'Indeterminate';
    this.genderValue[this.GENDER_INTERSEX] = 'Intersex';
    this.genderValue[this.GENDER_OTHER] = 'Other';

  }

  ionViewWillEnter() {
    this.loadData();
  }

  public hideOverlay(gender: string) {

    const loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `
      <div class="custom-spinner-container">
        <img src="assets/customSpinner.svg">
      </div>`
    });
    loading.present();

    this.userProfile.gender = gender;

    this.profileService.updateOne(this.userProfile.id, this.userProfile).subscribe(
      (response) => {
        this.dataLoading = false;
        loading.dismiss();
        this.overlayGender = false;
      },
      (errors) => {
        this.dataLoading = false;
        loading.dismiss();
        this.overlayGender = true;
        this.handleError(errors);
      }
    );

    this.overlayGender = true;

  }


  public onGender() {
    this.overlayGender = !this.overlayGender;
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

    this.profileService.getCurrent().subscribe(
      (response) => {
        this.userProfile = response;

        this.dataLoading = false;
        loading.dismiss();

        this.initializeForm();
      },
      (errors) => {
        loading.dismiss();
        this.handleError(errors);
      }
    );
  }

  ngOnInit() {
  }

  goBackPage() {
    this.navCtrl.pop();
  }

  onSomething() {
  }

  onAge() {
    this.navCtrl.push(ProfileEditAge, {
      profile: this.userProfile
    });
  }

  onLocation() {
    this.navCtrl.push(ProfileEditLocation, {
      profile: this.userProfile
    });
  }

  onChangePassword() {
    this.navCtrl.push(ProfileEditChangePassword, {
      profile: this.userProfile
    });
  }

  onAilment() {
    this.navCtrl.push(ProfileEditAilment, {
      profile: this.userProfile
    });
  }

  onProfilePrivacy() {
    this.navCtrl.push(ProfilePrivacy, {
      profile: this.userProfile
    });
  }

  private initializeForm() {
    this.profileForm = new FormGroup({
      'first_name': new FormControl(this.userProfile.first_name, Validators.required),
      'last_name': new FormControl(this.userProfile.last_name, Validators.required),
      'gender': new FormControl(this.userProfile.gender, Validators.required),
      'date_of_birth': new FormControl(this.userProfile.date_of_birth, Validators.required),
      'country': new FormControl((this.userProfile.hasOwnProperty('country')) ? this.userProfile.country : '', Validators.required),
      'city': new FormControl((this.userProfile.hasOwnProperty('city')) ? this.userProfile.city : null, Validators.required)
    });
  }

  onSubmit() {
    const loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `
      <div class="custom-spinner-container">
        <img src="assets/customSpinner.svg">
      </div>`
    });
    loading.present();

    let profileData = {
      first_name: this.profileForm.value.first_name,
      last_name: this.profileForm.value.last_name,
      gender: this.profileForm.value.gender,
      date_of_birth: this.profileForm.value.date_of_birth,
      country: {
        id: this.profileForm.value.country
      },
      city: {
        id: this.profileForm.value.city
      }
    };

    //console.log(profileData);

    this.profileService.updateOne(this.userProfile.id, profileData).subscribe(
      (response) => {

        let imageData = {
          profile: {
            id: this.userProfile.id
          },
          body: null,
          extension: "jpg"
        };

        if (this.base64Image) {
          imageData.body = this.base64Image;

          this.profileService.uploadImage(imageData).subscribe(
            (responseProfileImage) => {
              // this.dataLoading = false;
              // loading.dismiss();
            },
            (errorsProfileImage) => {
              // this.dataLoading = false;
              // loading.dismiss();
              this.handleError(errorsProfileImage);
            }
          );
        }

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

  onLoadPhoto() {

  }

  onTakePhoto() {
    Camera.getPicture({
      encodingType: Camera.EncodingType.JPEG,
      correctOrientation: true
    })
      .then(
        imageData => {
          //console.log(imageData);
          this.imageUrl = imageData;

          const toDataURL = url => fetch(url)
            .then(response => response.blob())
            .then(blob => new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.onerror = reject;
              reader.readAsDataURL(blob)
            }));

          toDataURL(imageData)
            .then(dataUrl => {
              // console.log('RESULT:');
              // console.log(dataUrl);
              this.base64Image = dataUrl.toString();
              this.base64Image = this.base64Image.replace('data:;base64,', '');
              // console.log('this.base64Image');
              // console.log(this.base64Image);
            })

        }
      )
      .catch(
        error => {
          console.log(error);
        }
      );
  }

  private handleError(errors: any) {
    let errorMessage = '';
    for (let error of errors) {
      if (error.message == 'something' && error.code == '401') {
        errorMessage += '<p>This is a custom error.</p>';
      } else {
        errorMessage += '<p>' + error.message + "</p>";
      }
    }

    const alert = this.alertCtrl.create({
      title: 'An error occurred!',
      message: errorMessage,
      buttons: ['Ok']
    });
    alert.present();
  }

  public getAge(dateOfBirth) {
    if ('string' === typeof dateOfBirth) {
      dateOfBirth = new Date(dateOfBirth);
    }
    let ageDifMs = Date.now() - dateOfBirth.getTime();
    let ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

}
