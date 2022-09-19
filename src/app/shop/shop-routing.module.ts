import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShopPage } from './shop.page';

const routes: Routes = [
  { path: '', redirectTo: ':id', pathMatch: 'full' },
  {
    path: ':id',
    children: [
      { path: '', component: ShopPage },
      {
        path: 'detail',
        loadChildren: () =>
          import('./shop-detail/shop-detail.module').then(
            (m) => m.ShopDetailModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopPageRoutingModule {}
