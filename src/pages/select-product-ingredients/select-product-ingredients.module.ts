import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectProductIngredientsPage } from './select-product-ingredients';

@NgModule({
  declarations: [
    SelectProductIngredientsPage,
  ],
  imports: [
    IonicPageModule.forChild(SelectProductIngredientsPage),
  ],
})
export class SelectProductIngredientsPageModule {}
