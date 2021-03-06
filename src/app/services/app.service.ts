import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor() {}
  public userInfoEvent: EventEmitter<any> = new EventEmitter();
  public notify: EventEmitter<any> = new EventEmitter();
  public geohash: string = '';
  public shopId: string = '';
  public searchAddress: any;
  public choosedAddress: { address: string; index: number } = {
    address: '',
    index: 0,
  };
  public confirmRemark: { remarkText: string; inputText: string } = {
    remarkText: '',
    inputText: '',
  };
  public orderDetail: any;

  getTabPagesIndex(pageName) {
    const tabPagesIndex: any = {
      MsitePage: 0,
      SearchPage: 1,
      OrderPage: 2,
      ProfilePage: 3,
    };
    return tabPagesIndex[pageName];
  }
}
