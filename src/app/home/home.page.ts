import { Component, OnInit } from '@angular/core';
import { Unknow } from 'src/typings';
import { RequestService } from '../services';

interface City extends Unknow {
  id: string | number;
  name: string;
}

interface GroupCity extends Unknow {
  letter: string;
  cities: City[];
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  guessCity: City = {
    name: '',
    id: '',
  };

  hotCities: City[] = [];

  groupCities: GroupCity[] = [];

  constructor(public requestService: RequestService) {}

  ngOnInit(): void {
    this.getCurrentCity();
    this.getHotCities();
    this.getGroupCity();
  }

  getCurrentCity() {
    this.requestService.getGuessCity().subscribe((res) => {
      this.guessCity.id = res.id;
      this.guessCity.name = res.name;
    });
  }

  getHotCities() {
    this.requestService.getHotCity().subscribe((res) => {
      if (Array.isArray(res)) {
        this.hotCities = res.map((v) => {
          return Object.assign({}, v, {
            name: v.name,
            id: v.id,
          });
        });
      }
    });
  }

  getGroupCity() {
    this.requestService.getGroupCity().subscribe((res) => {
      this.groupCities = res;
    });
  }
}
