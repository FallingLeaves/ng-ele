import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestService } from '../services';

@Component({
  selector: 'app-msite',
  templateUrl: './msite.page.html',
  styleUrls: ['./msite.page.scss'],
})
export class MsitePage implements OnInit {
  geohash: string = '';
  addressTitle: string = '';
  foodTypes: any[] = [];
  imgBaseUrl = 'https://fuss10.elemecdn.com';
  hasGetData: boolean = false;

  get latitude() {
    if (this.geohash) {
      return this.geohash.split(',')[0];
    }
    return '';
  }

  get longitude() {
    if (this.geohash) {
      return this.geohash.split(',')[1];
    }
    return '';
  }

  shopList: any[] = [];
  offset: number = 0;
  restaurantCategoryId: string = '';
  touchend: boolean = false;
  showLoading: boolean = true;
  preventRepeatReuqest: boolean = false; // 到达底部加载数据，防止重复加载

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public requestService: RequestService
  ) {
    this.geohash = this.route.snapshot.queryParamMap.get('geohash');
  }

  ngOnInit() {
    if (this.geohash) {
      this.getPoisGeohash();
      this.getMsiteFoodTypes();
      this.getShopList();
    } else {
      this.requestService.getGuessCity().subscribe((res) => {
        this.geohash = res.latitude + ',' + res.longitude;
        this.getPoisGeohash();
        this.getMsiteFoodTypes();
        this.getShopList();
      });
    }
  }

  toSearch() {}

  getPoisGeohash() {
    this.requestService.getPoisGeohash(this.geohash).subscribe((res) => {
      this.hasGetData = true;
      this.addressTitle = res.name;
    });
  }

  getMsiteFoodTypes() {
    this.requestService.getMsiteFoodTypes(this.geohash).subscribe((res) => {
      // console.log(res);
      const resArr = [...res];
      this.foodTypes = this.spliceArray(resArr, 8);
    });
  }

  spliceArray(array: any[], spliceLength: number) {
    const length: number = array.length;
    const foodArr: any[] = [];
    for (let i = 0, j = 0; i < length; i += spliceLength, j++) {
      foodArr[j] = array.splice(0, spliceLength);
    }
    return foodArr;
  }

  getCategoryId(url) {
    const urlData = decodeURIComponent(
      url.split('=')[1].replace('&target_name', '')
    );
    if (/restaurant_category_id/gi.test(urlData)) {
      return JSON.parse(urlData).restaurant_category_id.id;
    } else {
      return '';
    }
  }

  getShopList() {
    this.requestService
      .getShopList(
        this.latitude,
        this.latitude,
        this.offset,
        this.restaurantCategoryId
      )
      .subscribe((res) => {
        if (res.length < 20) {
          this.touchend = true;
        }
        this.shopList = [].concat(this.shopList).concat(res);
        this.showLoading = false;
        this.preventRepeatReuqest = false;
      });
  }

  loaderMore(event: any) {
    if (this.touchend) {
      event.target.disabled = true;
      return;
    }
    if (this.preventRepeatReuqest) {
      return;
    }
    this.offset += 20;
    this.showLoading = true;
    this.preventRepeatReuqest = true;
    this.getShopList();
    event.target.complete();
  }
}
