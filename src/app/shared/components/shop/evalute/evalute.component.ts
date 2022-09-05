import { Component, OnInit, Input } from '@angular/core';
import { RequestService, ShopService } from 'src/app/services';

@Component({
  selector: 'app-evalute',
  templateUrl: './evalute.component.html',
  styleUrls: ['./evalute.component.scss'],
})
export class EvaluteComponent implements OnInit {
  @Input() shopId: string;
  @Input() rating: string;
  ratingList: any; // 评价列表
  ratingOffset: number = 0; // 评价获取数据offset值
  ratingScoresData: any; // 评价总体分数
  showLoading: boolean = false;
  items: any[] = [];
  touchEnd: boolean = false;
  preventRepeatReuqest: boolean = false; // 到达底部加载数据，防止重复加载

  constructor(
    public requestService: RequestService,
    public shopService: ShopService
  ) {
    this.ratingList = this.shopService.ratingList;
    this.ratingScoresData = this.shopService.ratingScoresData;
    this.shopService.updateData.subscribe((res) => {
      this.ratingList = this.shopService.ratingList;
      this.ratingScoresData = this.shopService.ratingScoresData;
    });
  }

  ngOnInit() {}

  loaderMore(event: any) {
    if (this.preventRepeatReuqest) {
      return;
    }
    if (this.touchEnd) {
      event.target.disabled = true;
      return;
    }
    this.preventRepeatReuqest = true;
    this.ratingOffset += 10;
    this.showLoading = true;
    this.requestService
      .getRatingList(this.shopId, this.ratingOffset)
      .subscribe((res) => {
        this.preventRepeatReuqest = false;
        if (res.length < 10) {
          this.touchEnd = true;
        }
        event.target.complete();
        this.ratingList = [...this.ratingList, ...res];
      });
  }

  getRatingList(ratingOffset: number, name?: string) {
    this.requestService
      .getRatingList(this.shopId, ratingOffset, name)
      .subscribe((res) => {
        this.ratingList = this.shopService.ratingList;
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
