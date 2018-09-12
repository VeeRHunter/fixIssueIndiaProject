import {Injectable} from "@angular/core";
import {Profile as ProfileModel} from "../models/profile";

@Injectable()
export class HelperService {

  isHashtag(word: string) {
    return ('#' == word[0]);
  }

  getWordFromHashtag(word: string) {
    if ('#' == word[0]) {
      return word.replace(/[&\/\\#,+()$~%.'":;*?<>{}]/g, '');
    }
    return;
  }

  /**
   * Split body of a post into an array of 'normal' elements and 'hashtag' elements
   *
   * @param body
   * @returns {Array}
   */
  splitByHashtags(body: string): any {
    let elements = [];
    let previousElement = null;
    let currentElement = null;

    for (let word of body.split(' ')) {

      if (this.isHashtag(word)) {
        currentElement = 'hashtag';
      } else {
        currentElement = 'normal';
      }

      if ('hashtag' == currentElement || 'hashtag' == previousElement || null == previousElement) {
        elements.push(word);
      } else {
        elements[elements.length - 1] += ' ' + word;
      }

      previousElement = currentElement;
    }

    return elements;
  }

  public getUserProfileImage(profile: ProfileModel) {
    let profileImage = 'assets/images/no-person-image.jpg';

    if (profile.hasOwnProperty('profile_image') && profile.profile_image.small_url != null) {
      profileImage = profile.profile_image.small_url;
    }

    return profileImage;
  }

  public displayTimeDifference(startDate: any) {

    let seconds = this.getTimeDifference(startDate);

    if (seconds < 60) {
      return seconds + ' seconds ago';
    }

    let minutes = Math.floor(seconds / 60);

    if (minutes < 60) {
      return minutes + ' minutes ago';
    }

    let hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return hours + ' hours ago';
    }

    let days = Math.floor(hours / 24);

    if (days < 365) {
      return days + ' days ago';
    }

    let years = days / 365;

    let remainingDays = days - (years * days);

    return years + ' years and ' + remainingDays + ' ago';

  }

  public getTimeDifference(startDate: any) {
    let startDateObj = new Date(startDate);
    let now = new Date();
    let difference = (now.getTime() - startDateObj.getTime()) / 1000;
    return Math.floor(difference);
  }

}