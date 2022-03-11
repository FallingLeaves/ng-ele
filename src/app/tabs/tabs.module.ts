import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';
import { MsitePageModule } from '../msite/msite.module';
import { SearchPageModule } from '../search/search.module';
import { OrderPageModule } from '../order/order.module';
import { ProfilePageModule } from '../profile/profile.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabsPageRoutingModule,
    MsitePageModule,
    SearchPageModule,
    OrderPageModule,
    ProfilePageModule,
  ],
  declarations: [TabsPage],
})
export class TabsPageModule {}
