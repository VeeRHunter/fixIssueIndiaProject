import {Component} from '@angular/core';

import {Profile} from "../profile/profile";
import {Notifications} from "../notifications/notifications";
import {HelpList} from "../posts/practitioner/helpList";
import {Posts} from "../posts/posts";
import {ProfileService} from "../../service/profile";
import {Profile as ProfileModel} from "../../models/profile";
import {Events} from "ionic-angular";
import {PersonalizeBranch} from "../personalize-branch/personalize-branch";
import {Search} from "../search/search";

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  profilePage = Profile;
  notificationPage = Notifications;
  treeOfLife = Posts;
  practitionerHelpList = HelpList;
  settingsPage = PersonalizeBranch;
  searchPage = Search;

  notificationsCount = 0;
  isUserPractitioner = false;
  profile: ProfileModel;
  tolParams: any;
  practitionerHelpListParams: any;
  settingsPageParams: any;
  searchPageParams: any;
  dataLoaded = false;

  constructor(private profileService: ProfileService, public events: Events) {
    this.loadData();

    //used to get notification counter after user authentication
    let userProfile = JSON.parse(localStorage.getItem('userProfile'));
    this.notificationsCount = (userProfile && userProfile.hasOwnProperty('notifications')) ? userProfile.notifications : ''; // not loaded yet

    //event that update notification counter
    events.subscribe('notification:counter:updated', (counter) => {
      this.notificationsCount = counter;
    });

    events.subscribe('profile:updated', (profile) => {
      if (profile) {
        this.profile = profile;
      } else {
        this.loadData();
      }
    });

  }

  public loadData() {
    //get Profile
    this.profileService.getCurrent().subscribe(
      (profile) => {
        this.profile = profile;
        this.isUserPractitioner = (profile.is_practitioner && profile.hasOwnProperty('practitioner_account') && profile.practitioner_account.approved) ? true : false;
        this.tolParams = {
          profile: profile
        };
        this.practitionerHelpListParams = {
          profile: profile
        };
        this.settingsPageParams = {
          profile: profile
        };
        this.searchPageParams = {
          profile: profile
        };
        this.dataLoaded = true;
      },
      (errors) => {
        console.log(errors);
      }
    );
  }

  isApprovedPractitioner(profile): boolean {
    return (
      profile.is_practitioner
      && profile.hasOwnProperty('practitioner_account')
      && profile.practitioner_account.approved
    );
  }

  tabChanged(event: any) {
    if(undefined !== event) {
      if (event.length() > 1) {
        event.popToRoot();
      }
    }
  }
}
