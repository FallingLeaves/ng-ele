import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService, RequestService, LocalstorageService } from '../services';

@Component({
  selector: 'app-city',
  templateUrl: './city.page.html',
  styleUrls: ['./city.page.scss'],
})
export class CityPage implements OnInit {
  search: string = '';
  guessCity: string = '';
  guessCityId: string = '';
  placeList: any[] = [];
  placeNone: boolean = false;
  placeHistory: any[] = [];
  historyTitle: boolean = true;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public appService: AppService,
    public requestService: RequestService,
    public storageService: LocalstorageService
  ) {
    this.guessCityId = this.route.snapshot.paramMap.get('id');
    this.getCityById(this.guessCityId);
  }

  ngOnInit() {
    if (this.storageService.getStore('placeHistory')) {
      this.placeList = JSON.parse(this.storageService.getStore('placeHistory'));
    } else {
      this.placeList = [];
    }
  }

  getCityById(id: string) {
    this.requestService.getCityById(id).subscribe((res) => {
      this.guessCity = res.name;
    });
  }

  setSearchStorage(place: any) {
    const history = this.storageService.getStore('placeHistory');
    const choosePlace = place;
    if (history) {
      let checkrepeat = false;
      this.placeHistory = JSON.parse(history);
      this.placeHistory.forEach((item) => {
        if (item.geohash === place.geohash) {
          checkrepeat = true;
        }
      });
      if (!checkrepeat) {
        this.placeHistory.push(choosePlace);
      }
    } else {
      this.placeHistory.push(choosePlace);
    }
    this.storageService.setStore('placeHistory', this.placeHistory);
  }

  searchPlace() {
    if (!this.search) {
      return;
    }
    this.historyTitle = false;
    this.requestService
      .searchPlace(this.guessCityId, this.search)
      .subscribe((res) => {
        this.placeList = res;
        this.placeNone = res.length ? false : true;
      });
  }

  clearAll() {
    this.storageService.removeStore('placeHistory');
    this.placeList = [];
  }

  toMiste(place) {
    this.setSearchStorage(place);
    this.appService.geohash = place.geohash;
    this.router.navigateByUrl('/tabs/msite?geohash=' + place.geohash);
  }
}
