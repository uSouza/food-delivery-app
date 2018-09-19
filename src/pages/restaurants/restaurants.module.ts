import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RestaurantsPage } from './restaurants';
import { PopoverRestaurantPage } from './popover-restaurant/popover-restaurant';

@NgModule({
  declarations: [
  ],
  imports: [
    IonicPageModule.forChild(RestaurantsPage),
  ],
  entryComponents: [
    PopoverRestaurantPage
  ],
})
export class RestaurantsPageModule {}
