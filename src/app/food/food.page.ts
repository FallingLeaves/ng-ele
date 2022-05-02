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
    });
  }

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
  }
}
