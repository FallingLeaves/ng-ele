import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MsitePage } from './msite.page';

const routes: Routes = [
  {
    path: '',
    component: MsitePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MsitePageRoutingModule {}
