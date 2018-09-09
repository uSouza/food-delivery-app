import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopoverRestaurantPage } from './popover-restaurant';

@NgModule({
  declarations: [
    PopoverRestaurantPage,
  ],
  imports: [
    IonicPageModule.forChild(PopoverRestaurantPage),
  ],
})
export class PopoverRestaurantPageModule {}
