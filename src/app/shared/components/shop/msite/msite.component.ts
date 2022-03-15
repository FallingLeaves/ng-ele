import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-msite',
  templateUrl: './msite.component.html',
  styleUrls: ['./msite.component.scss'],
})
export class MsiteComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  distance: number;
  _shop: any;
  @Input()
  set shop(val: any) {
    this._shop = val;
    if (val && val.distance) {
      this.distance = Number(val);
    }
  }
  get shop() {
    return this._shop;
  }
  @Input() geohash: string;
  imgBaseUrl = 'http://cangdu.org:8001/img/';

  zhunShi(supports) {
    let zhunStatus;
    if (supports instanceof Array && supports.length) {
      supports.forEach((item) => {
        if (item.icon_name === '准') {
          zhunStatus = true;
        }
      });
    } else {
      zhunStatus = false;
    }
    return zhunStatus;
  }
}
