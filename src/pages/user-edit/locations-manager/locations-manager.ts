import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { Location } from '../../../models/location';
import { LocationsProvider } from '../../../providers/locations/locations';
import { UserEditPage } from '../user-edit';

@IonicPage()
@Component({
  selector: 'page-locations-manager',
  templateUrl: 'locations-manager.html',
})
export class LocationsManagerPage {

  location: Location= new Location();
  edit: boolean = false;
  access_token: any;
  loader = this.loadingCtrl.create({
    content: "Carregando..."
  });

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private locationService: LocationsProvider,
              public loadingCtrl: LoadingController,
              public toastCtrl: ToastController) {
    this.access_token = this.navParams.get('access_token');
  }

  ionViewDidLoad() {
    console.log(this.navParams.data);
    if (this.navParams.get('edit') != null) {
      this.edit = this.navParams.get('edit');
    }

    if (this.edit) {
      this.location = this.navParams.get('location');
    }

  }

  addLocation() {
    if (this.validate()) {
      this.loader.present();
      this.locationService.addLocationAccessToken(this.access_token, this.location)
        .subscribe(
          location => {
          this.addSuccess()
          }
        )
    }
  }

  updateLocation() {
    if (this.validate()) {
      this.loader.present();
      this.locationService.updateLocation(this.access_token, this.location)
        .subscribe(
          location => {
            this.updateSuccess()
          }
        )
    }
  }

  addSuccess() {
    this.loader.dismiss();
    let toast = this.toastCtrl.create({
      message: 'Local de entrega cadastrado com sucesso!',
      duration: 2000,
      position: 'bottom'
    });
    toast.present(toast);

    this.navCtrl.setRoot(UserEditPage);
  }

  updateSuccess() {
    this.loader.dismiss();
    let toast = this.toastCtrl.create({
      message: 'Local de entrega atualizado!',
      duration: 2000,
      position: 'bottom'
    });
    toast.present(toast);

    this.navCtrl.setRoot(UserEditPage);
  }

  validate(): boolean {
    if (this.location.address == null) {
      let toast = this.toastCtrl.create({
        message: 'É necessário informar o endereço!',
        duration: 2000,
        position: 'bottom'
      });
      toast.present(toast);
      return false;
    } else if (this.location.district == null) {
      let toast = this.toastCtrl.create({
        message: 'É necessário informar o bairro!',
        duration: 2000,
        position: 'bottom'
      });
      toast.present(toast);
      return false;
    }
    return true;
  }

}
