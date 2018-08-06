import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RestaurantMenuPage } from './restaurant-menu';

@NgModule({
  declarations: [
    RestaurantMenuPage,
  ],
  imports: [
    IonicPageModule.forChild(RestaurantMenuPage),
  ],
})
export class RestaurantMenuPageModule {}
