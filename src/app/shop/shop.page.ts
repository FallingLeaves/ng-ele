import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  ActivationEnd,
  NavigationEnd,
  Route,
  Router,
} from '@angular/router';
import { combineLatest } from 'rxjs';
import { RequestService } from '../services';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.page.html',
  styleUrls: ['./shop.page.scss'],
})
export class ShopPage implements OnInit {
  geohash: string = '';
  shopId: any = null; // 商店id值
  shopDetailData: any = null; // 商铺详情
  promotionInfo: string = '';
  showLoading: boolean = true;
  changeShowType: string = 'food'; // 切换显示商品或者评价
  imgBaseUrl: string = 'http://cangdu.org:8001/img/';
  showActivities: boolean = false; // 是否显示活动详情
  ratingScoresData: any; // 评价总体分数
  menuList: any[] = []; // 食品列表
  menuIndex: number = 0; // 已选菜单索引值，默认为0
  menuFood: any;
  categoryNum: any[] = []; // 商品类型右上角已加入购物车的数量
  receiveInCart: boolean = false; // 购物车组件下落的圆点是否到达目标位置
  totalPrice: any = 0; // 总共价格
  cartFoodList: any[] = []; // 购物车商品列表
  showCartList: boolean = false; // 显示购物车列表

  constructor(
    public route: ActivatedRoute,
    public requestService: RequestService,
    public router: Router
  ) {}

  get latitude() {
    return this.geohash && this.geohash.split(',')[0];
  }

  get longitude() {
    return this.geohash && this.geohash.split(',')[1];
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        console.log(event);
      }
    });
    combineLatest([this.route.params, this.route.queryParams]).subscribe(
      (res) => {
        const [params, queryParams] = res;
        console.log(params, queryParams);
        this.geohash = queryParams.geohash;
        this.shopId = params.id;
        this.getShopDetails();
        this.getFoodMenu();
      }
    );
  }

  getShopDetails() {
    this.requestService
      .getShopDetails(this.shopId, this.latitude, this.longitude)
      .subscribe((res) => {
        this.shopDetailData = res;
        this.promotionInfo =
          res.promotion_info || '欢迎光临，用餐高峰期请提前下单，谢谢。';
        this.showLoading = false;
      });
  }

  getFoodMenu() {
    this.requestService.getFoodMenu(this.shopId).subscribe((res) => {
      this.menuList = res;
      this.menuFood = this.menuList[0];
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

  getFoodImgPath(path: string) {
    if (path.includes('http')) {
      return path;
    }
    return this.imgBaseUrl + path;
  }

  // 购物车中总共商品的数量
  totalNum() {
    let num = 0;
    this.cartFoodList.forEach((item) => {
      num += item.num;
    });
    return num;
  }

  deliveryFee() {
    if (this.shopDetailData) {
      return this.shopDetailData.float_delivery_fee;
    } else {
      return null;
    }
  }

  minimumOrderAmount() {
    if (this.shopDetailData) {
      return this.shopDetailData.float_minimum_order_amount - this.totalPrice;
    } else {
      return null;
    }
  }

  chooseMenu(index) {
    this.menuIndex = index;
    this.menuFood = this.menuList[index];
  }
}
