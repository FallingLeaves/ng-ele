import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { LoginHeaderComponent } from './login-header/login-header.component';
import { BackHeaderComponent } from './back/back-header';
import { BackIconComponent } from './back/back-icon';
import { ElmSvgComponent } from './svg/svg';

const components = [
  LoginHeaderComponent,
  BackHeaderComponent,
  BackIconComponent,
  ElmSvgComponent,
];

@NgModule({
  imports: [CommonModule, RouterModule, IonicModule.forRoot()],
  declarations: [components],
  exports: [components],
})
export class ComponentsModule {}
