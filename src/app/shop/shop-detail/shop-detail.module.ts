import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopDetailComponent } from './shop-detail.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: ShopDetailComponent,
  },
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  declarations: [ShopDetailComponent],
})
export class ShopDetailModule {}
