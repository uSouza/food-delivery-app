import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { LocationsProvider } from '../../providers/locations/locations';
import { RestaurantsPage } from '../restaurants/restaurants';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-freights',
  templateUrl: 'freights.html',
})
export class FreightsPage {

  restaurant: any = null;
  access_token: any = null;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private storage: Storage,
              public locationsService: LocationsProvider,
              public viewCtrl: ViewController) {
    this.restaurant = navParams.get('restaurant');
    this.access_token = navParams.get('access_token');
  }

  ionViewDidLoad() {
    this.storage.get('city').then((city) => {
      if(city != null) {
        this.locationsService
        .getDistricts(this.access_token, city.id)
        .subscribe(
          districts => {
            districts.forEach(d => {
              let freights = this.restaurant.freights.find(f => f.district_id === d.id);
              if (freights == null) {
                const freight = {
                  company_id: this.restaurant.id,
                  district_id: d.id,
                  district: d,
                  value: 0
                };
                this.restaurant.freights.push(freight);
              }
            })
          }
        )
      } else {
        this.navCtrl.setRoot(RestaurantsPage);
      }
    });

  }

  goToHome() {
    this.viewCtrl.dismiss();
  }

}
