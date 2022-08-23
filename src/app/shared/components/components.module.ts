import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { LoginHeaderComponent } from './login-header/login-header.component';
import { BackHeaderComponent } from './back/back-header';
import { BackIconComponent } from './back/back-icon';
import { ElmSvgComponent } from './svg/svg';
import { ListComponent } from './shop/list/list.component';
import { MsiteComponent } from './shop/msite/msite.component';
import { LoadingComponent } from './loading/loading.component';
import { RatingStarComponent } from './rating-star/rating-star.component';
import { BuyCarComponent } from './buy-car/buy-car.component';

const components = [
  LoginHeaderComponent,
  BackHeaderComponent,
  BackIconComponent,
  ElmSvgComponent,
  ListComponent,
  MsiteComponent,
  LoadingComponent,
  RatingStarComponent,
  BuyCarComponent,
];

@NgModule({
  imports: [CommonModule, RouterModule, IonicModule.forRoot()],
  declarations: [components],
  exports: [components],
})
export class ComponentsModule {}
