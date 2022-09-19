import { Component, OnInit } from '@angular/core';
import { ShopService, RequestService } from '../../services';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-shop-detail',
  templateUrl: './shop-detail.component.html',
  styleUrls: ['./shop-detail.component.scss'],
})
export class ShopDetailComponent implements OnInit {
  shopDetailData: any;
  imgBaseUrl: string = 'http://cangdu.org:8001/img/';
  ratingScoresData: any;
  rating: any;

  geohash: string = '';
  shopId: any = null; // 商店id值

  showLoading: boolean = true;

  constructor(
    public shopService: ShopService,
    public requestService: RequestService,
    public route: ActivatedRoute
  ) {}

  get latitude() {
    return this.geohash && this.geohash.split(',')[0];
  }

  get longitude() {
    return this.geohash && this.geohash.split(',')[1];
  }

  get ratingParams() {
    return {
      rating: this.shopDetailData?.rating,
      title: this.shopDetailData?.name,
    };
  }

  ngOnInit() {
    combineLatest([this.route.params, this.route.queryParams]).subscribe(
      (res) => {
        const [params, queryParams] = res;
        this.geohash = queryParams.geohash;
        this.shopId = params.id;
        Promise.all([
          this.getShopDetails(),
          this.ratingScores(),
          this.getRatingList(0),
        ]).then(() => {
          this.showLoading = false;
        });
      }
    );
  }

  getShopDetails() {
    return new Promise((resolve, reject) => {
      this.requestService
        .getShopDetails(this.shopId, this.latitude, this.longitude)
        .subscribe((res) => {
          this.shopDetailData = res;
          resolve(null);
        });
    });
  }

  ratingScores() {
    return new Promise((resolve, reject) => {
      this.requestService.getRatingScores(this.shopId).subscribe((res) => {
        this.ratingScoresData = res;
        resolve(null);
      });
    });
  }

  getRatingList(ratingOffset: number, name?: string) {
    return new Promise((resolve, reject) => {
      this.requestService
        .getRatingList(this.shopId, ratingOffset, name)
        .subscribe((res) => {
          this.rating = res[0];
          resolve(null);
        });
    });
  }

  getImgPath(path) {
    let suffix;
    if (!path) {
      return 'http://test.fe.ptdev.cn/elm/elmlogo.jpeg';
    }
    if (path.indexOf('jpeg') !== -1) {
      suffix = '.jpeg';
    } else {
      suffix = '.png';
    }
    const url =
      '/' +
      path.substr(0, 1) +
      '/' +
      path.substr(1, 2) +
      '/' +
      path.substr(3) +
      suffix;
    return 'https://fuss10.elemecdn.com' + url;
  }
}
