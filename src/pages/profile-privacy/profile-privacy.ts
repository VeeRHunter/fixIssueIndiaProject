import {Component, OnInit} from '@angular/core';
import {IonicPage, AlertController, LoadingController, NavController, NavParams} from 'ionic-angular';
import {ProfilePrivacyService} from "../../service/profile-privacy";
import {ProfileService} from "../../service/profile";
import {Observable} from "../../../node_modules/rxjs/Observable";

@IonicPage({name: "profile-privacy", segment: "profile-privacy"})
@Component({
  selector: 'profile-privacy',
  templateUrl: 'profile-privacy.html',
})
export class ProfilePrivacy implements OnInit {
  private snapshotAboutMe: string = '';
  public dataLoading: boolean = false;
  public profile: any;
  public showSaveButton = false;
  public profilePrivacyList: any;
  public profileExcludeList: any = [
    {
      key: 'exclusion.profile.first-name',
      name: 'First Name',
      excluded: false
    },
    {
      key: 'exclusion.profile.last-name',
      name: 'Last Name',
      excluded: false
    },
    {
      key: 'exclusion.profile.gender',
      name: 'Gender',
      excluded: false
    },
    {
      key: 'exclusion.profile.birthdate',
      name: 'Birthdate',
      excluded: false
    },
    {
      key: 'exclusion.profile.country',
      name: 'Country',
      excluded: false
    },
    {
      key: 'exclusion.profile.city',
      name: 'City',
      excluded: false
    },
    {
      key: 'exclusion.profile.image',
      name: 'Images',
      excluded: false
    },
    {
      key: 'exclusion.profile.ailment',
      name: 'Ailment',
      excluded: false
    },
    {
      key: 'exclusion.profile.mood',
      name: 'Mood',
      excluded: false
    },
    {
      key: 'exclusion.profile.bio',
      name: 'Personal bio',
      excluded: false
    }
  ];

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController,
              private profilePrivacyService: ProfilePrivacyService,
              private profileService: ProfileService) {
  }

  private getProfileExcludeByKey(key) {
    for (let profileExclude of this.profileExcludeList) {
      if (profileExclude.key == key) {
        return profileExclude;
      }
    }
  }

  private getProfilePrivacyByKey(key) {
    for (let profilePrivacy of this.profilePrivacyList) {
      if (profilePrivacy.excluded_group == key) {
        return profilePrivacy;
      }
    }
  }

  public verifyContentChanged() {
    if (this.snapshotAboutMe !== this.profile.personal_bio) {
      this.showSaveButton = true;
    } else {
      this.showSaveButton = false;
    }
  }

  ngOnInit() {
    this.profile = this.navParams.get('profile');
    this.snapshotAboutMe = JSON.parse(JSON.stringify(this.profile.personal_bio));

    const loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `
      <div class="custom-spinner-container">
        <img src="assets/customSpinner.svg">
      </div>`
    });
    loading.present();
    this.loadData().subscribe(
      () => {
        this.dataLoading = false;
        loading.dismiss();
      },
      (error) => {
        this.dataLoading = false;
        loading.dismiss();
      }
    )
  }

  public loadData(): Observable<any> {
    return Observable.create((observer) => {
      this.profilePrivacyService.getAll().subscribe(
        (profilePrivacyList) => {
          this.profilePrivacyList = profilePrivacyList;

          for (let profilePrivacy of this.profilePrivacyList) {
            if (profilePrivacy.profile.id == this.profile.id) {

              for (let profileExclude of this.profileExcludeList) {
                if (profileExclude.key == profilePrivacy.excluded_group) {
                  profileExclude.excluded = true;
                }
              }
            }
          }
          observer.next(profilePrivacyList);
          observer.complete();
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }

  goBackPage() {
    this.navCtrl.pop();
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
    this.dataLoading = true;

    this.profileService.updateOne(this.profile.id, this.profile).subscribe(
      (response) => {
        this.loadData().subscribe(
          () => {
            this.dataLoading = false;
            loading.dismiss();
          },
          (error) => {
            this.dataLoading = false;
            loading.dismiss();
          }
        )
      },
      (errors) => {
        this.dataLoading = false;
        loading.dismiss();
        this.handleError(errors);
      }
    );
  }

  onUpdate(excludedGroup) {
    const loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `
      <div class="custom-spinner-container">
        <img src="assets/customSpinner.svg">
      </div>`
    });
    loading.present();
    this.dataLoading = true;
    let profileExclude = this.getProfileExcludeByKey(excludedGroup);

    if (profileExclude.excluded) {
      //create
      let data = {
        profile: {
          id: this.profile.id
        },
        excluded_group: excludedGroup
      };

      this.profilePrivacyService.createOne(data).subscribe(
        (response) => {
          this.loadData().subscribe(
            () => {
              this.dataLoading = false;
              loading.dismiss();
            },
            (error) => {
              this.dataLoading = false;
              loading.dismiss();
            }
          )
        },
        (errors) => {
          this.handleError(errors);
          this.dataLoading = false;
          loading.dismiss();
        }
      );
    } else {
      //delete
      let profilePrivacy = this.getProfilePrivacyByKey(excludedGroup);

      this.profilePrivacyService.deleteOne(profilePrivacy.id).subscribe(
        (response) => {
          this.loadData().subscribe(
            () => {
              this.dataLoading = false;
              loading.dismiss();
            },
            (error) => {
              this.dataLoading = false;
              loading.dismiss();
            }
          )
        },
        (errors) => {
          this.handleError(errors);
          this.dataLoading = false;
          loading.dismiss();
        }
      );
    }

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

  get isApprovedPractitioner(): boolean {
    return (
      this.profile.is_practitioner
      && this.profile.hasOwnProperty('practitioner_account')
      && this.profile.practitioner_account.approved
    );
  }
}
