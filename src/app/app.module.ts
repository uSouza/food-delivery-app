import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { RestaurantsPage } from '../pages/restaurants/restaurants';
import { RestaurantMenuPage } from "../pages/restaurant-menu/restaurant-menu";
import { SelectProductIngredientsPage } from "../pages/select-product-ingredients/select-product-ingredients";
import { SelectProductSizePage } from "../pages/select-product-size/select-product-size";
import { AdditionalsPage } from "../pages/additionals/additionals";
import { RegisterPage } from "../pages/register/register";
import { LocationsPage } from "../pages/locations/locations";
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


@NgModule({
  declarations: [
    MyApp,
    RestaurantsPage,
    RestaurantMenuPage,
    SelectProductIngredientsPage,
    SelectProductSizePage,
    LoginPage,
    AdditionalsPage,
    RegisterPage
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
    SelectProductSizePage,
    LoginPage,
    AdditionalsPage,
    RegisterPage
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
    ClientsProvider
  ]
})
export class AppModule {}
