import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Authorization } from '../../models/authorization';
import { LocationsProvider } from '../../providers/locations/locations';
import { RestaurantsPage } from '../restaurants/restaurants';
import { LoginPage } from '../login/login';
import { Observable } from 'rxjs/Observable';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { UsersProvider } from '../../providers/users/users';
import { UserPandeco } from '../../models/user-pandeco';
import { Storage } from '@ionic/storage';
import { LocationsManagerPage } from './locations-manager/locations-manager';

/**
 * Generated class for the UserEditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-edit',
  templateUrl: 'user-edit.html',
})
export class UserEditPage {

  authorizationService: Observable<Authorization>;
  authorization: Authorization;
  access_token: any = null;
  locations: any[] = [];
  loader = this.loadingCtrl.create({
    content: "Carregando..."
  });

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private storage: Storage,
              public locationService: LocationsProvider,
              public authenticationService: AuthenticationProvider,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              private userService: UsersProvider) {
  }

  ionViewDidLoad() {
    if (this.navParams.get('clientAuthorization') != null) {
      this.access_token = this.navParams.data.clientAuthorization.access_token;
    }
    if (this.access_token == null) {
      this.loader.present();
      this.authenticationService
      .getGuestBearer()
      .subscribe(
        authorization => {
          this.isLogged(authorization)
        }
      );
    } else {
      this.getUser(this.access_token);
    }

  }

  isLogged(authorization: Authorization) {
    this.authorization = authorization;
    this.storage.get('token').then((val) => {
      if (val == null) {
        this.goToLoginPage();
      } else {
        this.getUser(val);
      }
    });
  }

  getUser(val: any) {

    if (this.access_token == null) {
      this.access_token = val;
    }

    this.loader.present();
    this.userService.getUser(val)
    .subscribe(
      userPandeco => {
        this.getClientLocations(userPandeco, val)
      },
      err => {
        this.goToLoginPage()
      }
    );
  }

  getClientLocations(user: UserPandeco, val: any) {
    this.locationService
      .getLocationsAccessToken(val)
      .subscribe(
        locations => this.setLocations(locations)
      )
  }

  setLocations(locations) {
    this.loader.dismiss();
    this.locations = locations;
  }

  goToLoginPage() {
    this.loader.dismiss();
    this.navCtrl.setRoot(LoginPage, {page:'userEditPage', authorization: this.authorization});
  }

  goToHome() {
    this.navCtrl.setRoot(RestaurantsPage);
  }

  editLocation(location: any) {
    this.navCtrl.push(LocationsManagerPage,
      {
        edit: true,
        location: location,
        access_token: this.access_token
      }
    );
  }

  addLocation() {
    this.navCtrl.push(LocationsManagerPage, {access_token: this.access_token});
  }

  deleteLocation(location_id: any) {
    const confirm = this.alertCtrl.create({
      title: 'Deletar local',
      message: 'Tem certeza em deletar o local?',
      buttons: [
        {
          text: 'Não',
          handler: () => {
          }
        },
        {
          text: 'Sim',
          handler: () => {
            this.locationService
              .deleteLocation(this.access_token, location_id)
              .subscribe(
                () => this.navCtrl.setRoot(UserEditPage)
              );
          }
        }
      ]
    });
    confirm.present();
  }

}
