import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LocationsManagerPage } from './locations-manager';

@NgModule({
  declarations: [
    LocationsManagerPage,
  ],
  imports: [
    IonicPageModule.forChild(LocationsManagerPage),
  ],
})
export class LocationsManagerPageModule {}
