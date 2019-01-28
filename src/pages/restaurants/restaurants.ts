import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController, NavParams, AlertController, Platform, PopoverController, ToastController } from 'ionic-angular';
import { RestaurantsProvider } from '../../providers/restaurants/restaurants';
import { Restaurant } from "../../models/restaurant";
import { AuthenticationProvider } from "../../providers/authentication/authentication";
import { Authorization } from "../../models/authorization";
import { Observable } from "rxjs/Observable";
import { RestaurantMenuPage } from "../restaurant-menu/restaurant-menu";
import { LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DatePipe } from '@angular/common';
import { PopoverRestaurantPage } from './popover-restaurant/popover-restaurant';
import { SocialSharing } from '@ionic-native/social-sharing';
import { isCordovaAvailable } from '../../common/is-cordova-available';
import { LocationsProvider } from '../../providers/locations/locations';
import { FreightsPage } from '../freights/freights';
import { AppVersion } from '@ionic-native/app-version';

@IonicPage()
@Component({
  selector: 'page-restaurants',
  templateUrl: 'restaurants.html',
})
export class RestaurantsPage {

  restaurants: Restaurant[];
  cities = [];
  city: any = null;
  authorizationService: Observable<Authorization>;
  authorization: Authorization;
  isWeb: boolean = false;
  logged: boolean = false;
  loader = this.loadingCtrl.create({
    content: "Carregando..."
  });

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public restaurantService: RestaurantsProvider,
              public authenticationService: AuthenticationProvider,
              private storage: Storage,
              public toastCtrl: ToastController,
              private socialSharing: SocialSharing,
              public loadingCtrl: LoadingController,
              private locationService: LocationsProvider,
              private appVersion: AppVersion,
              public alertCtrl: AlertController,
              public modalCtrl: ModalController,
              public platform: Platform,
              public datepipe: DatePipe,
              public popoverCtrl: PopoverController
            ) {
  }

  ionViewDidLoad() {
    this.authenticationService
      .getGuestBearer()
      .subscribe(
        authorization => {
          this.validateMinVersion(authorization);
        },
        err => {
          this.exitApp()
        }
      );
      this.storage.get('token').then((val) => {
        if(val != null) {
          this.logged = true;
        }
      });
      if (! isCordovaAvailable()) {
        this.isWeb = true;
      }
  }

  validateMinVersion(authorization) {
    if (isCordovaAvailable()) {
      this.appVersion.getVersionNumber().then(version => {
        console.log('Versão', version);
        this.authenticationService
          .getMinVersion(authorization.access_token)
          .subscribe(
            minVersion => {
              if (parseInt(version.split('.')[0]) < parseInt(minVersion.version.split('.')[0])
                  || parseInt(version.split('.')[1]) < parseInt(minVersion.version.split('.')[1])
                  || parseInt(version.split('.')[2]) < parseInt(minVersion.version.split('.')[2])) {
                    const confirm = this.alertCtrl.create({
                      title: 'Atualização obrigatória',
                      message: 'A versão do seu aplicativo Pandeco é inferior a mínima requerida para o funcionamento normal da ferramenta. Por gentileza, clique no botão abaixo para atualizá-lo. Qualquer dúvida, entre em contato conosco pelo e-mail contato@pandeco.com.br. Obrigado!',
                      buttons: [
                        {
                          text: 'Atualizar',
                          handler: () => {
                            window.open('market://details?id=br.com.pandeco.pandeco_app', '_system' );
                            this.platform.exitApp();
                          }
                        }
                      ],
                      enableBackdropDismiss: false
                    });
                    confirm.present();
                  } else {
                    this.setAuthorization(authorization);
                  }
            }
          )
      });
    } else {
      this.setAuthorization(authorization);
    }

  }

  showFreights(restaurant) {
    let profileModal = this.modalCtrl.create(FreightsPage, { restaurant: restaurant, city: this.city, access_token: this.authorization.access_token });
    profileModal.present();
    profileModal.onDidDismiss(data => {
      console.log(data);
    });
  }

  exitApp() {
    const confirm = this.alertCtrl.create({
      title: 'Falha com a conexão com a internet',
      message: 'Verifique a conexão com a internet!',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.platform.exitApp();
          }
        }
      ]
    });
    confirm.present();
  }

  setAuthorization(authorization: Authorization) {
    this.authorization = authorization;
    this.storage.get('city').then((val) => {
      if(val == null) {
        this.getCities();
      } else {
        this.city = val;
        this.getRestaurants();
      }
    });
  }

  getCities() {
    this.locationService
      .getCities(this.authorization.access_token)
      .subscribe(
        cities => {
          this.cities = cities;
          this.showCityRadio();
        }
      )
  }

  showCityRadio() {
    let alert = this.alertCtrl.create({ enableBackdropDismiss: false });
    alert.setTitle('Cidades disponíveis');
    this.cities.forEach(c => {
      alert.addInput({
        type: 'radio',
        label: c.name,
        value: c,
        checked: false
      });
    });

    alert.addButton('Cancelar');
    alert.addButton({
      text: 'OK',
      handler: data => {
        if (data != null) {
          this.city = data;
          this.storage.set('city', this.city);
          this.getRestaurants();
        } else {
          this.showToast('É necessário selecionar uma cidade!');
          this.showCityRadio();
        }
      }
    });
    alert.present();
  }

  showToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });
    toast.present(toast);
  }

  getRestaurants() {
    this.loader.present();
    this.restaurantService.getRestaurantsByCity(this.authorization, this.city).subscribe(
        restaurants => this.setRestaurants(restaurants)
    );
  }

  setRestaurants(restaurants) {
    this.loader.dismiss();
    if (restaurants.length > 0) {
      restaurants.forEach(r => {
        let addHour = parseInt(r.open_at.split(':')[0]) + 1;
        r.open_at = addHour + ':' + r.open_at.split(':')[1] + ':' + r.open_at.split(':')[2];
        r.open_at = this.datepipe.transform('2018-01-01 ' + r.open_at, 'H:mm');
      });
      this.restaurants = restaurants;
    } else {
      const confirm = this.alertCtrl.create({
        title: 'Não há restaurantes disponívels',
        message: 'Infelizmente ainda não chegamos na sua cidade, mas estamos trabalhando duro para isso!',
        buttons: [
          {
            text: 'OK',
            handler: () => {
              this.showCityRadio();
            }
          }
        ]
      });
      confirm.present();
    }
  }

  getRestaurantsByName(ev) {
    var val = ev.target.value;

    if (val && val.trim() != '') {
      this.restaurants = this.restaurants.filter((restaurant) => {
        return (restaurant.fantasy_name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
    else {
      this.getRestaurants();
    }
  }

  goToRestaurantMenuPage(restaurant: Restaurant) {
    this.navCtrl.push(RestaurantMenuPage, {restaurant: restaurant, authorization: this.authorization});
  }

  presentPopover(event) {
    let popover = this.popoverCtrl.create(PopoverRestaurantPage);
    popover.present({
      ev: event
    });
  }

  chat() {
    this.socialSharing.shareViaWhatsAppToReceiver('554591058739', 'Olá, preciso de ajuda.').then(() => {
      console.log('works');
    }).catch(() => {
      console.log('not works');
    });
  }

}
