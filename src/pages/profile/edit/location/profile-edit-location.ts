import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, AlertController} from 'ionic-angular';
import {Profile} from "../../../../models/profile";
import {ProfileService} from "../../../../service/profile";
import {ViewChild, NgZone} from "@angular/core";
import {Headers, Http, RequestOptions} from "@angular/http";
import AutocompleteService = google.maps.places.AutocompleteService;

@IonicPage({name: "profile-edit-location", segment: "profile-edit-location"})
@Component({
  selector: 'page-profile-edit-location',
  templateUrl: 'profile-edit-location.html',
})
export class ProfileEditLocation {
  public autocompleteItems;
  public dataLoading: boolean = false;
  public userProfile: Profile = null;
  public errors: any = [];
  profile: Profile;
  public autocompleteService;

  @ViewChild('autocomplete') autocomplete;

  constructor(private navCtrl: NavController,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private navParams: NavParams,
              private profileService: ProfileService,
              private http: Http,
              private zone: NgZone) {
    this.autocompleteService = new AutocompleteService();
    this.profile = this.navParams.get('profile');
    this.autocompleteItems = [];
  }

  chooseItem(item: any) {
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', 'GET, OPTIONS');
    headers.append('Accept', 'application/json');
    let options = new RequestOptions({headers: headers});
    let baseUrl = 'https://maps.googleapis.com/maps/api/place/details/json';

    this.http.get(`${baseUrl}?placeid=${item.placeId}&key=AIzaSyCO68PLrwO3nHweQfaqOcDg4e-g_dMlQHw`, options).subscribe(
      (placeDetails: any) => {
        let address = placeDetails.json().result.address_components;
        let city, country;
        if(address.length > 0) {
          address.forEach((component) => {
            let types = component.types;
            if (types.indexOf('locality') > -1) {
              city = component.long_name;
            }

            if (types.indexOf('country') > -1) {
              country = component.long_name;
            }

            this.profile.city = city;
            this.profile.country = country;
            this.autocomplete.value = `${city} / ${country}`;
          });
        }
      }
    );
    this.autocompleteItems = [];
  }

  updateSearch(event) {
    let autocompleteQuery = this.autocomplete.value + event.key;
    if (autocompleteQuery == '') {
      this.autocompleteItems = [];
      return;
    }

    let self = this;
    this.autocompleteService.getPlacePredictions({
      input: autocompleteQuery
    }, (predictions, status) => {
      self.autocompleteItems = [];

      self.zone.run(() => {
        if (predictions != null) {
          predictions.forEach((prediction) => {
            self.autocompleteItems.push({
              description: prediction.description,
              placeId: prediction.place_id
            });
          });
        }
      });
    });
  }

  goBackPage() {
    this.navCtrl.pop();
  }

  onSubmit() {
    if (!this.profile.country || !this.profile.city) {
      const alert = this.alertCtrl.create({
        title: 'An error occurred!',
        message: 'Both fields City and Country are mandatory!',
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

    this.profileService.updateOne(this.profile.id, this.profile).subscribe(
      (response) => {
        this.dataLoading = false;
        loading.dismiss();

        this.navCtrl.pop();
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
