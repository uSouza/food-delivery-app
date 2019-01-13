import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LocationsManagerPage } from './locations-manager';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  declarations: [
  ],
  imports: [
    IonicPageModule.forChild(LocationsManagerPage),
    IonicSelectableModule
  ],
})
export class LocationsManagerPageModule {}
