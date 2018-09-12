import {Component, OnInit} from '@angular/core';
import {
  IonicPage, AlertController, LoadingController, NavController, NavParams,
  ActionSheetController, Events
} from 'ionic-angular';
import {PractitionerAccountService} from "../../service/practitioner-account";
import {Profile} from "../../models/profile";
import {FOP} from "./field-of-practice/fop";
import {Camera} from "ionic-native";
import {PhotoViewer} from '@ionic-native/photo-viewer';

@IonicPage({name: "practitioner-create", segment: "practitioner-create" })
@Component({
  selector: 'create-practitioner',
  templateUrl: 'create-practitioner.html',
})
export class CreatePractitioner implements OnInit {

  public practitionerAccount: any;
  public profile: Profile;
  public action: any;
  public imageUrl: any;
  public medical_licence_file: any;
  public other_document_file: any;
  public medical_certificate_file: any;
  public id_card_file: any;
  public driver_license_file: any;

  private isDriverLicenseFileDone: boolean = true;
  private isMedicalLicenceFileDone: boolean = true;
  private isMedicalCertificateFileDone: boolean = true;
  private isIdCardFileDone: boolean = true;
  private isOtherDocumentFileDone: boolean = true;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController,
              private actionSheetCtrl: ActionSheetController,
              private practitionerAccountService: PractitionerAccountService,
              private photoViewer: PhotoViewer,
              public events: Events) {
    this.profile = this.navParams.get('profile');
  }

  ngOnInit() {

    if (this.profile.hasOwnProperty('practitioner_account') && this.profile.practitioner_account.hasOwnProperty('id')) {

      this.action = 'update';

      this.practitionerAccount = this.profile.practitioner_account;
      this.practitionerAccount.profile = {
        id: this.profile.id
      };

    } else {

      this.action = 'create';
      this.practitionerAccount = {
        business_address: "Please add your business address",
        medical_id_number: "Please add your medical ID number",
        professional_bio: "Please add your professional bio",
        field_of_practice: null,
        profile: {
          id: this.profile.id
        }
      };
    }

  }

  goBackPage() {
    this.navCtrl.pop();
  }

  //used to get parameters when pop the page from FieldOfPractice
  myCallbackFunction = (_params) => {
    return new Promise((resolve, reject) => {

      this.practitionerAccount.field_of_practice = {
        id: _params.fopId,
        name: _params.fopName,
      };

      resolve();
    });
  };

  onFieldOfPractice() {
    this.navCtrl.push(FOP, {
      profile: this.profile,
      callback: this.myCallbackFunction
    });
  }

  onSomething() {
  }

  onPhotoView(type: string) {
    switch (type) {
      case 'medical_licence_url': {
        this.photoViewer.show(this.practitionerAccount.medical_license_url, 'Medical licence', {share: false});
        break;
      }
      case 'medical_certificate_url': {
        this.photoViewer.show(this.practitionerAccount.medical_certificate_url, 'Medical ID', {share: false});
        break;
      }
      case 'id_card_url': {
        this.photoViewer.show(this.practitionerAccount.id_card_url, 'ID card', {share: false});
        break;
      }
      case 'driver_license_url': {
        this.photoViewer.show(this.practitionerAccount.driver_license_url, 'Driver licence', {share: false});
        break;
      }
      case 'other_document_url': {
        this.photoViewer.show(this.practitionerAccount.other_document_url, 'Alternative health licence', {share: false});
        break;
      }
      default: {
        break;
      }
    }

  }

  onSubmit() {

    if ('create' == this.action) {

      let valid: boolean = true;
      let errorMessage: string = '';

      if (!this.practitionerAccount.field_of_practice) {
        errorMessage += '<p>Please add the Field of Practice</p>';
        valid = false;
      }

      if (!this.medical_licence_file || !this.medical_licence_file.body) {
        errorMessage += '<p>Please add the Medical License image</p>';
        valid = false;
      }

      if (!this.medical_certificate_file || !this.medical_certificate_file.body) {
        errorMessage += '<p>Please add the Medical Certificate image</p>';
        valid = false;
      }

      if (!this.id_card_file || !this.id_card_file.body) {
        errorMessage += '<p>Please add the ID card image</p>';
        valid = false;
      }

      if (!this.driver_license_file || !this.driver_license_file.body) {
        errorMessage += '<p>Please add your driver license image</p>';
        valid = false;
      }

      if (!valid) {

        let alert = this.alertCtrl.create({
          title: 'Missing info',
          subTitle: errorMessage,
          buttons: ['OK']
        });
        alert.present();

      } else {

        const loading = this.loadingCtrl.create({
          spinner: 'hide',
          content: `
      <div class="custom-spinner-container">
        <img src="assets/customSpinner.svg">
      </div>`
        });
        loading.present();

        this.practitionerAccountService.createOne(this.practitionerAccount).subscribe(
          (response) => {
            loading.dismiss();

            this.practitionerAccount = response;
            this.action = 'update';

            this.loadImages();

            let alert = this.alertCtrl.create({
              title: 'Thank you',
              subTitle: 'You will receive an email shortly',
              buttons: ['OK']
            });
            alert.present();

          },
          (errors) => {
            loading.dismiss();
            this.handleError(errors);
          }
        );
      }

    } else if ('update' == this.action) {

      const loading = this.loadingCtrl.create({
        spinner: 'hide',
        content: `
      <div class="custom-spinner-container">
        <img src="assets/customSpinner.svg">
      </div>`
      });
      loading.present();

      this.practitionerAccountService.update(this.practitionerAccount).subscribe(
        (response) => {

          this.loadImages();
          loading.dismiss();

          let alert = this.alertCtrl.create({
            title: 'Thank you',
            subTitle: 'You will receive an email shortly',
            buttons: ['OK']
          });
          alert.present();

          this.events.publish('profile:updated');

        },
        (errors) => {
          loading.dismiss();
          this.handleError(errors);
        }
      );
    }

  }

  loadImages() {

    if (this.medical_licence_file && this.medical_licence_file.body) {
      this.isMedicalLicenceFileDone = false;
      this.practitionerAccountService.uploadFile(this.practitionerAccount.id, 'medical-licence', this.medical_licence_file).subscribe(
        (response) => {
          this.isMedicalLicenceFileDone = true;
          this.loadPractitionerAccountWhenReady();
        },
        (errors) => {
          this.handleError(errors);
          this.isMedicalLicenceFileDone = true;
          this.loadPractitionerAccountWhenReady();
        }
      );
    }

    if (this.medical_certificate_file && this.medical_certificate_file.body) {
      this.isMedicalCertificateFileDone = false;
      this.practitionerAccountService.uploadFile(this.practitionerAccount.id, 'medical-certificate', this.medical_certificate_file).subscribe(
        (response) => {
          this.isMedicalCertificateFileDone = true;
          this.loadPractitionerAccountWhenReady();
        },
        (errors) => {
          this.handleError(errors);
          this.isMedicalCertificateFileDone = true;
          this.loadPractitionerAccountWhenReady();
        }
      );
    }

    if (this.id_card_file && this.id_card_file.body) {
      this.isIdCardFileDone = false;
      this.practitionerAccountService.uploadFile(this.practitionerAccount.id, 'id-card', this.id_card_file).subscribe(
        (response) => {
          this.isIdCardFileDone = true;
          this.loadPractitionerAccountWhenReady();
        },
        (errors) => {
          this.handleError(errors);
          this.isIdCardFileDone = true;
          this.loadPractitionerAccountWhenReady();
        }
      );
    }

    if (this.driver_license_file && this.driver_license_file.body) {
      this.isDriverLicenseFileDone = false;
      this.practitionerAccountService.uploadFile(this.practitionerAccount.id, 'driver-licence', this.driver_license_file).subscribe(
        (response) => {
          this.isDriverLicenseFileDone = true;
          this.loadPractitionerAccountWhenReady();
        },
        (errors) => {
          this.handleError(errors);
          this.isDriverLicenseFileDone = true;
          this.loadPractitionerAccountWhenReady();
        }
      );
    }

    if (this.other_document_file && this.other_document_file.body) {
      this.isOtherDocumentFileDone = false;
      this.practitionerAccountService.uploadFile(this.practitionerAccount.id, 'other-document', this.other_document_file).subscribe(
        (response) => {
          this.isOtherDocumentFileDone = true;
          this.loadPractitionerAccountWhenReady();
        },
        (errors) => {
          this.handleError(errors);
          this.isOtherDocumentFileDone = true;
          this.loadPractitionerAccountWhenReady();
        }
      );
    }
  }

  loadPractitionerAccountWhenReady() {

    if (
      this.isMedicalLicenceFileDone &&
      this.isMedicalCertificateFileDone &&
      this.isIdCardFileDone &&
      this.isDriverLicenseFileDone
    ) {

      // const loading = this.loadingCtrl.create({
      //   content: 'Loading data ...'
      // });
      // loading.present();

      this.practitionerAccountService.getOne(this.practitionerAccount.id).subscribe(
        (response) => {
          //loading.dismiss();
          this.practitionerAccount = response;

          this.medical_licence_file = this.medical_certificate_file = this.id_card_file = this.driver_license_file  = this.other_document_file = null;
        },
        (errors) => {
          //loading.dismiss();
          this.handleError(errors);
        }
      );

    }
  }

  onUploadImage(imageType) {

    let title = null;

    switch (imageType) {
      case 'medical_licence': {
        title = 'Upload your medical licence';
        break;
      }
      case 'medical_certificate': {
        title = 'Upload your medical certificate';
        break;
      }
      case 'id_card': {
        title = 'Upload your ID card';
        break;
      }
      case 'driver_license': {
        title = 'Upload your Driver Licence or Passport';
        break;
      }
      default: {
        break;
      }
    }

    let actionSheet = this.actionSheetCtrl.create({
      title: title,
      buttons: [
        {

          text: 'Take photo',
          handler: () => {
            this.onTakePhoto(imageType);
          }
        }, {
          text: 'Choose photo',
          handler: () => {
            this.accessGallery(imageType);
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    actionSheet.present();
  }

  onTakePhoto(imageType) {
    Camera.getPicture({
      encodingType: Camera.EncodingType.JPEG,
      correctOrientation: true
    })
      .then(
        imageData => {
          // console.log('imageData');
          // console.log(imageData);
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
              let image = dataUrl.toString();
              image = image.replace('data:;base64,', '');

              switch (imageType) {
                case 'medical_licence': {
                  this.medical_licence_file = {
                    body: image,
                    extension: 'jpg',
                  };
                  break;
                }
                case 'medical_certificate': {
                  this.medical_certificate_file = {
                    body: image,
                    extension: 'jpg',
                  };
                  break;
                }
                case 'id_card': {
                  this.id_card_file = {
                    body: image,
                    extension: 'jpg',
                  };
                  break;
                }
                case 'driver_license': {
                  this.driver_license_file = {
                    body: image,
                    extension: 'jpg',
                  };
                  break;
                }
                case 'other_document': {
                  this.other_document_file = {
                    body: image,
                    extension: 'jpg',
                  };
                  break;
                }
                default: {
                  break;
                }
              }
            })

        }
      )
      .catch(
        error => {
          console.log(error);
        }
      );
  }

  accessGallery(imageType) {
    Camera.getPicture({
      sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
      destinationType: Camera.DestinationType.DATA_URL
    }).then((imageData) => {

      let image = imageData;
      //image = 'data:image/jpeg;base64,' + image;

      this.imageUrl = image;

      switch (imageType) {
        case 'medical_licence': {
          this.medical_licence_file = {
            body: image,
            extension: 'jpg',
          };
          break;
        }
        case 'medical_certificate': {
          this.medical_certificate_file = {
            body: image,
            extension: 'jpg',
          };
          break;
        }
        case 'id_card': {
          this.id_card_file = {
            body: image,
            extension: 'jpg',
          };
          break;
        }
        case 'driver_license': {
          this.driver_license_file = {
            body: image,
            extension: 'jpg',
          };
          break;
        }
        case 'other_document': {
          this.other_document_file = {
            body: image,
            extension: 'jpg',
          };
          break;
        }
        default: {
          break;
        }
      }
    }, (err) => {
      console.log(err);
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