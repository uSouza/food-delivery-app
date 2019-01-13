import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LocationsPage } from './locations';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  declarations: [
  ],
  imports: [
    IonicPageModule.forChild(LocationsPage),
    IonicSelectableModule
  ],
})
export class LocationsPageModule {}
