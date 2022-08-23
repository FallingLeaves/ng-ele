import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  ActivationEnd,
  NavigationEnd,
  Route,
  Router,
} from '@angular/router';
import { combineLatest } from 'rxjs';
import { RequestService, CartService, LocalstorageService } from '../services';

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
  shopCart: any;
  choosedFoods: any; // 当前选中视频数据
  showSpecs: boolean = false; // 控制显示食品规格
  specsIndex: number = 0; // 当前选中的规格索引值
  showMoveDot: any[] = []; // 控制下落的小圆点显示隐藏
  elLeft: number = 0; // 当前点击加按钮在网页中的绝对top值
  elBottom: number = 0; // 当前点击加按钮在网页中的绝对left值

  constructor(
    public route: ActivatedRoute,
    public requestService: RequestService,
    public router: Router,
    public cartService: CartService,
    public localStorageService: LocalstorageService
  ) {
    this.cartFoodList = [];
  }

  initCart() {
    const initCart = this.localStorageService.getStore('buyCart');
    if (initCart) {
      this.cartService.cartList = JSON.parse(initCart);
      this.shopCart = { ...this.cartService.cartList[this.shopId] };
    }
  }

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
        this.initCart();
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
      this.initCategoryNum();
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

  initCategoryNum() {
    const newArr = [];
    let cartFoodNum = 0;
    this.totalPrice = 0;
    this.cartFoodList = [];
    this.menuList.forEach((item, index) => {
      if (this.shopCart && this.shopCart[item.foods[0].category_id]) {
        let num = 0;
        Object.keys(this.shopCart[item.foods[0].category_id]).forEach(
          (itemid) => {
            Object.keys(
              this.shopCart[item.foods[0].category_id][itemid]
            ).forEach((foodid) => {
              const foodItem =
                this.shopCart[item.foods[0].category_id][itemid][foodid];
              num += foodItem.num;
              if (item.type === 1) {
                this.totalPrice += foodItem.num * foodItem.price;
                if (foodItem.num > 0) {
                  this.cartFoodList[cartFoodNum] = {};
                  this.cartFoodList[cartFoodNum].category_id =
                    item.foods[0].category_id;
                  this.cartFoodList[cartFoodNum].item_id = itemid;
                  this.cartFoodList[cartFoodNum].food_id = foodid;
                  this.cartFoodList[cartFoodNum].num = foodItem.num;
                  this.cartFoodList[cartFoodNum].price = foodItem.price;
                  this.cartFoodList[cartFoodNum].name = foodItem.name;
                  this.cartFoodList[cartFoodNum].specs = foodItem.specs;
                  cartFoodNum++;
                }
              }
            });
          }
        );
        newArr[index] = num;
      } else {
        newArr[index] = 0;
      }
    });
    this.totalPrice = this.totalPrice.toFixed(2);
    this.categoryNum = [...newArr];
  }

  shopCartChange() {
    this.shopCart = { ...this.cartService.cartList[this.shopId] };
    this.initCategoryNum();
  }

  onShowChooseList(foods?: any) {
    if (foods) {
      this.choosedFoods = foods;
    }
    this.showSpecs = !this.showSpecs;
    this.specsIndex = 0;
  }

  onShowMoveDot(event) {
    this.showMoveDot = event.showMoveDot;
    this.elLeft = event.elLeft;
    this.elBottom = event.elBottom;
  }

  chooseSpecs(index) {
    this.specsIndex = index;
  }

  addSpecs(
    category_id,
    item_id,
    food_id,
    name,
    price,
    specs,
    packing_fee,
    sku_id,
    stock
  ) {
    this.cartService.addCart({
      shopid: this.shopId,
      category_id,
      item_id,
      food_id,
      name,
      price,
      specs,
      packing_fee,
      sku_id,
      stock,
    });
    this.onShowChooseList();
    this.shopCartChange();
  }

  toggleCartList() {
    this.showCartList = !this.showCartList;
  }

  clearCart() {
    this.toggleCartList();
    this.cartService.clearCart(this.shopId);
    this.shopCartChange();
  }

  // 加入购物车，所需7个参数，商铺id，食品分类id，食品id，食品规格id，食品名字，食品价格，食品规格
  addToCart(category_id, item_id, food_id, name, price, specs) {
    this.cartService.addCart({
      shopid: this.shopId,
      category_id,
      item_id,
      food_id,
      name,
      price,
      specs,
    });
    this.initCategoryNum();
  }
  // 移出购物车，所需7个参数，商铺id，食品分类id，食品id，食品规格id，食品名字，食品价格，食品规格
  removeOutCart(category_id, item_id, food_id, name, price, specs) {
    this.cartService.reduceCart({
      shopid: this.shopId,
      category_id,
      item_id,
      food_id,
      name,
      price,
      specs,
    });
    this.initCategoryNum();
    if (!this.cartFoodList.length) {
      this.showCartList = false;
    }
  }
}
