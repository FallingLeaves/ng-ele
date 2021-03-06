import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MsitePageRoutingModule } from './msite-routing.module';

import { MsitePage } from './msite.page';
import { ComponentsModule } from "../shared/components/components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    MsitePageRoutingModule
  ],
  declarations: [MsitePage]
})
export class MsitePageModule {}
