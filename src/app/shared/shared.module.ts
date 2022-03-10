import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from './components/components.module';

@NgModule({
  imports: [CommonModule, IonicModule.forRoot()],
  declarations: [],
  exports: [CommonModule, IonicModule, ComponentsModule],
})
export class SharedModule {}
