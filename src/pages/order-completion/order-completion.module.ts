import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderCompletionPage } from './order-completion';
import { AccordionListComponent } from '../../components/accordion-list/accordion-list';

@NgModule({
  declarations: [
    OrderCompletionPage,
    AccordionListComponent
  ],
  imports: [
    IonicPageModule.forChild(OrderCompletionPage),
  ],
})
export class OrderCompletionPageModule {}
