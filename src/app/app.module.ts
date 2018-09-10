import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { RestaurantsPage } from '../pages/restaurants/restaurants';
import { PopoverRestaurantPage } from '../pages/restaurants/popover-restaurant/popover-restaurant';
import { RestaurantMenuPage } from "../pages/restaurant-menu/restaurant-menu";
import { SelectProductIngredientsPage } from "../pages/select-product-ingredients/select-product-ingredients";
import { SelectProductSizePage } from "../pages/select-product-size/select-product-size";
import { AdditionalsPage } from "../pages/additionals/additionals";
import { MyOrdersPage } from "../pages/my-orders/my-orders";
import { RegisterPage } from "../pages/register/register";
import { LocationsPage } from "../pages/locations/locations";
import { OrderCompletionPage } from "../pages/order-completion/order-completion";
import { PreOrderCompletionPage } from "../pages/pre-order-completion/pre-order-completion";
import { OrderDetailPage } from "../pages/order-detail/order-detail";
import { UserEditPage } from "../pages/user-edit/user-edit";
import { LocationsManagerPage } from "../pages/user-edit/locations-manager/locations-manager";
import { HttpClientModule } from "@angular/common/http";

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthenticationProvider } from '../providers/authentication/authentication';
import { RestaurantsProvider } from '../providers/restaurants/restaurants';
import { ProductsProvider } from '../providers/products/products';
import { MenusProvider } from '../providers/menus/menus';
import { IngredientsProvider } from '../providers/ingredients/ingredients';
import { LoginPage } from "../pages/login/login";
import { UsersProvider } from '../providers/users/users';
import { ClientsProvider } from '../providers/clients/clients';
import { LocationsProvider } from '../providers/locations/locations';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SQLite } from '@ionic-native/sqlite';
import { IonicStorageModule } from '@ionic/storage';
import { BrMaskerModule } from 'brmasker-ionic-3';
import { AccordionListComponent } from '../components/accordion-list/accordion-list';
import { OrdersProvider } from '../providers/orders/orders';
import {DatePipe} from '@angular/common';

@NgModule({
  declarations: [
    MyApp,
    RestaurantsPage,
    RestaurantMenuPage,
    SelectProductIngredientsPage,
    SelectProductSizePage,
    LoginPage,
    AdditionalsPage,
    RegisterPage,
    LocationsPage,
    OrderCompletionPage,
    MyOrdersPage,
    OrderDetailPage,
    UserEditPage,
    LocationsManagerPage,
    PopoverRestaurantPage,
    PreOrderCompletionPage,
    AccordionListComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    IonicStorageModule.forRoot(),
    BrMaskerModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    RestaurantsPage,
    RestaurantMenuPage,
    SelectProductIngredientsPage,
    SelectProductSizePage,
    LoginPage,
    AdditionalsPage,
    RegisterPage,
    LocationsPage,
    OrderCompletionPage,
    MyOrdersPage,
    OrderDetailPage,
    UserEditPage,
    AccordionListComponent,
    LocationsManagerPage,
    PreOrderCompletionPage,
    PopoverRestaurantPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthenticationProvider,
    RestaurantsProvider,
    ProductsProvider,
    MenusProvider,
    IngredientsProvider,
    UsersProvider,
    ClientsProvider,
    LocationsProvider,
    SQLite,
    OrdersProvider,
    DatePipe
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule {}
