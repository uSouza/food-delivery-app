import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderCompletionPage } from './order-completion';

@NgModule({
  declarations: [
    OrderCompletionPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderCompletionPage),
  ],
})
export class OrderCompletionPageModule {}
