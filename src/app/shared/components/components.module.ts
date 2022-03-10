import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { LoginHeaderComponent } from './login-header/login-header.component';

const components = [LoginHeaderComponent];

@NgModule({
  imports: [CommonModule, RouterModule, IonicModule.forRoot()],
  declarations: [components],
  exports: [components],
})
export class ComponentsModule {}
