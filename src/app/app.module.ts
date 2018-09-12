import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';
import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {Login} from '../pages/login/login';
import {Register} from '../pages/register/register';
import {AuthenticationService} from "../service/authentication";
import {HttpModule} from "@angular/http";
import {UserService} from "../service/user";
import {TabsPage} from "../pages/tabs/tabs";
import {LoginModule} from "../pages/login/login.module";
import {RegisterModule} from "../pages/register/register.module";
import {ProfileModule} from "../pages/profile/profile.module";
import {Profile} from "../pages/profile/profile";
import {TermsModule} from "../pages/terms/terms.module";
import {Terms} from "../pages/terms/terms";
import {ForgotPasswordModule} from "../pages/forgot-password/forgot-password.module";
import {ForgotPassword} from "../pages/forgot-password/forgot-password";
import {ProfileEditModule} from "../pages/profile/edit/profile-edit.module";
import {ProfileEdit} from "../pages/profile/edit/profile-edit";
import {CountryService} from "../service/country";
import {CityService} from "../service/city";
import {ProfileService} from "../service/profile";
import {PasswordResetModule} from "../pages/forgot-password/password-reset/password-reset.module";
import {PasswordReset} from "../pages/forgot-password/password-reset/password-reset";
import {PasswordResetService} from "../service/password-reset";
import {PersonalizeBranchModule} from "../pages/personalize-branch/personalize-branch.module";
import {PersonalizeBranch} from "../pages/personalize-branch/personalize-branch";
import {ProfileEditAge} from "../pages/profile/edit/age/profile-edit-age";
import {ProfileEditAgeModule} from "../pages/profile/edit/age/profile-edit-age.module";
import {ProfileEditLocationModule} from "../pages/profile/edit/location/profile-edit-location.module";
import {ProfileEditLocation} from "../pages/profile/edit/location/profile-edit-location";
import {OnboardingModule} from "../pages/onboarding/onboarding.module";
import {OnboardingService} from "../service/onboarding";
import {ProfileEditChangePasswordModule} from "../pages/profile/edit/change-password/change-password.module";
import {ProfileEditChangePassword} from "../pages/profile/edit/change-password/change-password";
import {AilmentCategoryService} from "../service/ailment-category";
import {ProfileEditAilmentModule} from "../pages/profile/edit/ailment/ailment.module";
import {ProfileEditAilment} from "../pages/profile/edit/ailment/ailment";
import {CreatePractitionerModule} from "../pages/create-practitioner/create-practitioner.module";
import {CreatePractitioner} from "../pages/create-practitioner/create-practitioner";
import {PractitionerAccountService} from "../service/practitioner-account";
import {ProfilePrivacyModule} from "../pages/profile-privacy/profile-privacy.module";
import {ProfilePrivacy} from "../pages/profile-privacy/profile-privacy";
import {ProfilePrivacyService} from "../service/profile-privacy";
import {ProfileCreateService} from "../service/profileCreate";
import {FieldOfPracticeService} from "../service/field-of-practice";
import {FOP} from "../pages/create-practitioner/field-of-practice/fop";
import {FOPModule} from "../pages/create-practitioner/field-of-practice/fop.module";
import {PostService} from "../service/post";
import {DoMoreModule} from "../pages/do-more/do-more.module";
import {DoMore} from "../pages/do-more/do-more";
import {Posts} from "../pages/posts/posts";
import {PostsModule} from "../pages/posts/posts.module";
import {YoutubeVideoPlayer} from "@ionic-native/youtube-video-player";
import {PostsAdd} from "../pages/posts/add/posts-add";
import {PostsAddModule} from "../pages/posts/add/posts-add.module";
import {BranchPostsModule} from "../pages/posts/branch/branch-posts.module";
import {BranchPosts} from "../pages/posts/branch/branch-posts";
import {MoodService} from "../service/mood";
import {MoodChangeService} from "../service/moodChange";
import {ProfileView} from "../pages/profile/view/profile";
import {ProfileViewModule} from "../pages/profile/view/profile.module";
import {UserFollowService} from "../service/userFollow";
import {PostView} from "../pages/posts/view/post";
import {PostViewModule} from "../pages/posts/view/post.module";
import {KarmaPointService} from "../service/karma-point";
import {ImpactPointService} from "../service/impact-point";
import {TagService} from "../service/tag";
import {PostsFilteredModule} from "../pages/posts/filtered/posts.module";
import {PostsFiltered} from "../pages/posts/filtered/posts";
import {HelperService} from "../service/helper";
import {NotificationService} from "../service/notification";
import {NotificationsModule} from "../pages/notifications/notifications.module";
import {Notifications} from "../pages/notifications/notifications";
import {HelpListModule} from "../pages/posts/practitioner/helpList.module";
import {HelpList} from "../pages/posts/practitioner/helpList";
import {Facebook} from "@ionic-native/facebook";
import {PostMenu} from "../pages/post-menu/post-menu";
import {PostMenuModule} from "../pages/post-menu/post-menu.module";
import {PostReportService} from "../service/post-report";
import {ProfileReportService} from "../service/profile-report";
import {ProfileProvider} from "../service/profile-provider";
import {Device} from "@ionic-native/device";
import {PhotoViewer} from "@ionic-native/photo-viewer";
import {GooglePlus} from "@ionic-native/google-plus";
import {SearchModule} from "../pages/search/search.module";
import {Search} from "../pages/search/search";
import {ShareModule} from "../pages/share/share.module";
import {Share} from "../pages/share/share";
import {ShareService} from "../service/share";
import {CapitalizePipe} from "../pipe/capitalize";
import {AngularGooglePlaceModule} from 'angular-google-place';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TabsPage,
    CapitalizePipe
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    LoginModule,
    RegisterModule,
    ForgotPasswordModule,
    PasswordResetModule,
    FOPModule,
    ProfileModule,
    ProfileEditModule,
    ProfileEditAgeModule,
    ProfileEditLocationModule,
    ProfileEditChangePasswordModule,
    ProfileEditAilmentModule,
    ProfileViewModule,
    PersonalizeBranchModule,
    ProfilePrivacyModule,
    TermsModule,
    OnboardingModule,
    CreatePractitionerModule,
    DoMoreModule,
    PostsModule,
    PostViewModule,
    PostsAddModule,
    BranchPostsModule,
    PostsFilteredModule,
    NotificationsModule,
    HelpListModule,
    PostMenuModule,
    SearchModule,
    ShareModule,
    AngularGooglePlaceModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    Login,
    Register,
    ForgotPassword,
    PasswordReset,
    Terms,
    FOP,
    Profile,
    ProfileEdit,
    ProfileEditAge,
    ProfileEditLocation,
    ProfileEditChangePassword,
    ProfileEditAilment,
    ProfilePrivacy,
    ProfileView,
    PersonalizeBranch,
    TabsPage,
    CreatePractitioner,
    DoMore,
    Posts,
    PostView,
    PostsAdd,
    BranchPosts,
    PostsFiltered,
    Notifications,
    HelpList,
    PostMenu,
    Search,
    Share,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AuthenticationService,
    PasswordResetService,
    UserService,
    ProfileService,
    ProfileCreateService,
    CountryService,
    CityService,
    OnboardingService,
    AilmentCategoryService,
    FieldOfPracticeService,
    PractitionerAccountService,
    ProfilePrivacyService,
    PostService,
    MoodService,
    MoodChangeService,
    YoutubeVideoPlayer,
    UserFollowService,
    KarmaPointService,
    ImpactPointService,
    TagService,
    HelperService,
    NotificationService,
    Facebook,
    GooglePlus,
    PostReportService,
    ProfileReportService,
    ProfileProvider,
    Device,
    PhotoViewer,
    ShareService,
    {
      provide: ErrorHandler,
      useClass: IonicErrorHandler
    }
  ]
})
export class AppModule {
}
