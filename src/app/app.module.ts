import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { RestaurantsPage } from '../pages/restaurants/restaurants';
import { RestaurantMenuPage } from "../pages/restaurant-menu/restaurant-menu";
import { SelectProductIngredientsPage } from "../pages/select-product-ingredients/select-product-ingredients";
import { SelectProductSizePage } from "../pages/select-product-size/select-product-size";
import { HttpClientModule } from "@angular/common/http";

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthenticationProvider } from '../providers/authentication/authentication';
import { RestaurantsProvider } from '../providers/restaurants/restaurants';
import { ProductsProvider } from '../providers/products/products';
import { MenusProvider } from '../providers/menus/menus';
import { IngredientsProvider } from '../providers/ingredients/ingredients';


@NgModule({
  declarations: [
    MyApp,
    RestaurantsPage,
    RestaurantMenuPage,
    SelectProductIngredientsPage,
    SelectProductSizePage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    RestaurantsPage,
    RestaurantMenuPage,
    SelectProductIngredientsPage,
    SelectProductSizePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthenticationProvider,
    RestaurantsProvider,
    ProductsProvider,
    MenusProvider,
    IngredientsProvider
  ]
})
export class AppModule {}
