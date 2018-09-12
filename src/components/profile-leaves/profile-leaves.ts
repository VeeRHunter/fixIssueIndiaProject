import {Component, Input} from '@angular/core';
import {Profile as ProfileModel} from "../../models/profile";

@Component({
  selector: 'profile-leaves',
  templateUrl: 'profile-leaves.html'
})
export class ProfileLeavesComponent {

  @Input() userProfile: ProfileModel;

  constructor() {
  }

  isApprovedPractitioner(profile): boolean {
    return (
      profile.is_practitioner
      && profile.hasOwnProperty('practitioner_account')
      && profile.practitioner_account.approved
    );
  }

}
