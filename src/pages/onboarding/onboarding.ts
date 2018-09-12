import {Component} from "@angular/core";
import {IonicPage, LoadingController, NavController} from "ionic-angular";
import {OnboardingService} from "../../service/onboarding";

/**
 * Generated class for the OnboardingPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage({name: "onboarding", segment: "onboarding" })
@Component({
  selector: 'page-onboarding',
  templateUrl: 'onboarding.html',
})
export class OnboardingPage {
  public steps: any = [];
  public errors: any = [];

  constructor(private navCtrl: NavController,
              private onboardingService: OnboardingService,
              private loadingCtrl: LoadingController) {
  }

  //noinspection JSUnusedGlobalSymbols
  public ionViewDidLoad() {
    const loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `
      <div class="custom-spinner-container">
        <img src="assets/customSpinner.svg">
      </div>`
    });
    loading.present();

    this.onboardingService.getAllActive().subscribe(
      (steps) => {
        //go to root if no onboarding step is defined
        if (0 === steps.length) {
          this.navCtrl.popToRoot();
        }
        this.steps = steps;
        loading.dismiss();
      },
      (errors) => {
        this.errors = errors;
        loading.dismiss();
      }
    );
  }

  public markAsComplete(): void {
    OnboardingService.markUserAsHavingTheTutorialComplete();
    this.navCtrl.popToRoot();
  }
}
