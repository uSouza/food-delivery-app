import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { RestaurantsPage } from '../pages/restaurants/restaurants';
import { RestaurantMenuPage } from "../pages/restaurant-menu/restaurant-menu";
import { HttpClientModule } from "@angular/common/http";

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthenticationProvider } from '../providers/authentication/authentication';
import { RestaurantsProvider } from '../providers/restaurants/restaurants';


@NgModule({
  declarations: [
    MyApp,
    RestaurantsPage,
    RestaurantMenuPage,
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
    RestaurantMenuPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthenticationProvider,
    RestaurantsProvider
  ]
})
export class AppModule {}
