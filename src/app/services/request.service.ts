import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  constructor(private http: HttpClient) {}

  getCity(type: string): Observable<any> {
    return this.http.get('/v1/cities' + `?type=${type}`);
  }

  getGuessCity(): Observable<any> {
    return this.getCity('guess');
  }

  getHotCity(): Observable<any> {
    return this.getCity('hot');
  }

  getGroupCity(): Observable<any> {
    return this.getCity('group').pipe(
      map((res) => {
        const sortCities = [];
        for (let i = 65; i <= 90; i++) {
          if (res[String.fromCharCode(i)]) {
            sortCities.push({
              letter: String.fromCharCode(i),
              cities: res[String.fromCharCode(i)],
            });
          }
        }
        return sortCities;
      })
    );
  }

  getCityById(id: string): Observable<any> {
    return this.http.get('/v1/cities' + `/${id}`);
  }

  searchPlace(cityId: string, keyword: string): Observable<any> {
    const params = {
      type: 'search',
      city_id: cityId,
      keyword,
    };
    return this.http.get('/v1/pois', { params });
  }

  getPoisGeohash(geohash: string): Observable<any> {
    return this.http.get('/v2/pois' + `/${geohash}`);
  }

  getMsiteFoodTypes(geohash: string): Observable<any> {
    const params = {
      geohash,
      group_type: '1',
      'flags[]': 'F',
    };
    return this.http.get('/v2/index_entry', { params });
  }

  getShopList(
    latitude,
    longitude,
    offset,
    restaurantCategoryId = '',
    restaurantCategoryIds = '',
    orderBy = '',
    deliveryMode = '',
    supportIds = []
  ): Observable<any> {
    let supportStr = '';
    supportIds.forEach((item) => {
      if (item.status) {
        supportStr += '&support_ids[]=' + item.id;
      }
    });
    const params = {
      latitude,
      longitude,
      offset,
      limit: '20',
      'extras[]': 'activities',
      keyword: '',
      restaurant_category_id: restaurantCategoryId,
      'restaurant_category_ids[]': restaurantCategoryIds,
      order_by: orderBy,
      'delivery_mode[]': deliveryMode + supportStr,
    };
    return this.http.get('/shopping/restaurants', { params });
  }

  getFoodCategory(latitude, longitude) {
    const params = {
      latitude,
      longitude,
    };
    return this.http.get('/shopping/v2/restaurant/category', { params });
  }
}
