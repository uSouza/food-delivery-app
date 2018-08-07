import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectProductSizePage } from './select-product-size';

@NgModule({
  declarations: [
    SelectProductSizePage,
  ],
  imports: [
    IonicPageModule.forChild(SelectProductSizePage),
  ],
})
export class SelectProductSizePageModule {}
