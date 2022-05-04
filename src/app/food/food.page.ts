import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RequestService } from '../services';

@Component({
  selector: 'app-food',
  templateUrl: './food.page.html',
  styleUrls: ['./food.page.scss'],
})
export class FoodPage implements OnInit {
  headTitle: string = '';
  foodTitle: string = '';
  geohash: string = '';
  restaurantCategoryId: string = '';
  restaurantCategoryIds: string = '';
  category: Array<any> = [];
  categoryDetail: Array<any> = [];
  sortBy: string = '';
  sortByType: string = '';
  filterNum: number;
  deliveryMode: number;
  supportIds: any[] = [];
  delivery: any = [];
  activity: any = [];
  offset: number = 0;
  touchend: boolean = false;
  showLoading: boolean = false;
  preventRepeatReuqest: boolean = false; // 到达底部加载数据，防止重复加载
  shopList: any[] = [];

  constructor(
    public route: ActivatedRoute,
    public requestService: RequestService
  ) {}

  get latitude() {
    return this.geohash && this.geohash.split(',')[0];
  }

  get longitude() {
    return this.geohash && this.geohash.split(',')[1];
  }

  ngOnInit() {
    this.route.queryParams.subscribe((res) => {
      console.log(res);
      this.headTitle = res.title;
      this.geohash = res.geohash;
      this.restaurantCategoryId = res.restaurant_category_id;
      this.foodTitle = this.headTitle;
      this.getFoodCategory();
      this.getFoodDelivery();
      this.getFoodActivity();
      this.getShopList();
    });
  }

  getShopList(loaderMore?: boolean) {
    this.showLoading = true;
    this.requestService
      .getShopList(
        this.latitude,
        this.longitude,
        this.offset,
        this.restaurantCategoryId,
        this.restaurantCategoryIds,
        this.sortByType,
        this.deliveryMode + '',
        this.supportIds
      )
      .subscribe((res) => {
        if (res.length < 20) {
          this.touchend = true;
        }
        if (loaderMore) {
          this.shopList = [...this.shopList, ...res];
        } else {
          this.shopList = [...res];
        }
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
    this.getShopList(true);
    event.target.complete();
  }

  // 获取分类
  getFoodCategory() {
    this.requestService
      .getFoodCategory(this.latitude, this.longitude)
      .subscribe((res: any) => {
        this.category = res;
        this.category.forEach((item) => {
          if (item.id == this.restaurantCategoryId) {
            this.categoryDetail = item.sub_categories;
          }
        });
      });
  }

  getFoodDelivery() {
    this.requestService
      .getFoodDelivery(this.latitude, this.longitude)
      .subscribe((res) => {
        this.delivery = res;
      });
  }

  getFoodActivity() {
    this.requestService
      .getFoodActivity(this.latitude, this.longitude)
      .subscribe((res) => {
        this.activity = res;
        this.activity.forEach((item, index) => {
          this.supportIds[index] = { status: false, id: item.id };
        });
      });
  }

  chooseType(type) {
    if (this.sortBy !== type) {
      this.sortBy = type;
      // food选项中头部标题发生改变，需要特殊处理
      if (type === 'food') {
        this.foodTitle = '分类';
      } else {
        // 将foodTitle 和 headTitle 进行同步
        this.foodTitle = this.headTitle;
      }
    } else {
      // 再次点击相同选项时收回列表
      this.sortBy = '';
      if (type === 'food') {
        // 将foodTitle 和 headTitle 进行同步
        this.foodTitle = this.headTitle;
      }
    }
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

  // 选中Category左侧列表的某个选项时，右侧渲染相应的sub_categories列表
  selectCategoryName({ id, image_url }, index) {
    // 第一个选项 -- 全部商家 因为没有自己的列表，所以点击则默认获取选所有数据
    if (!image_url) {
      this.restaurantCategoryIds = null;
      this.sortBy = '';
      // 不是第一个选项时，右侧展示其子级sub_categories的列表
    } else {
      this.restaurantCategoryId = id;
      this.categoryDetail = this.category[index].sub_categories;
    }
  }

  // 选中Category右侧列表的某个选项时，进行筛选，重新获取数据并渲染
  getCategoryIds(id, name) {
    this.restaurantCategoryIds = id;
    this.sortBy = '';
    this.foodTitle = this.headTitle = name;
    this.offset = 0;
    this.getShopList();
  }

  // 点击某个排序方式，获取事件对象的data值，并根据获取的值重新获取数据渲染
  sortList(event) {
    let node;
    //  如果点击的是 span 中的文字，则需要获取到 span 的父标签 p
    if (event.target.nodeName.toUpperCase() !== 'P') {
      node = event.target.parentNode;
    } else {
      node = event.target;
    }
    this.sortByType = node.getAttribute('data');
    this.sortBy = '';
    this.offset = 0;
    this.getShopList();
  }

  // 筛选选项中的配送方式选择
  selectDeliveryMode(id) {
    // deliveryMode为空时，选中当前项，并且filterNum加一
    if (this.deliveryMode == null) {
      this.filterNum++;
      this.deliveryMode = id;
      // deliveryMode为当前已有值时，清空所选项，并且filterNum减一
    } else if (this.deliveryMode === id) {
      this.filterNum--;
      this.deliveryMode = null;
      // deliveryMode已有值且不等于当前选择值，则赋值deliveryMode为当前所选id
    } else {
      this.deliveryMode = id;
    }
  }

  // 点击商家活动，状态取反
  selectSupportIds(index, id) {
    // 数组替换新的值
    this.supportIds.splice(index, 1, {
      status: !this.supportIds[index].status,
      id,
    });
    // 重新计算filterNum的个数
    this.filterNum = this.deliveryMode ? 1 : 0;
    this.supportIds.forEach((item) => {
      if (item.status) {
        this.filterNum++;
      }
    });
  }

  // 只有点击清空按钮才清空数据，否则一直保持原有状态
  clearSelect() {
    this.supportIds.map((item) => (item.status = false));
    this.filterNum = 0;
    this.deliveryMode = null;
  }
}
