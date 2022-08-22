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

  /*  获取food页面的配送方式 */

  getFoodDelivery(latitude, longitude): any {
    const params = {
      latitude,
      longitude,
      kw: '',
    };
    return this.http.get('/shopping/v1/restaurants/delivery_modes', { params });
  }

  /* 获取food页面的商家属性活动列表 */

  getFoodActivity(latitude, longitude): any {
    const params = {
      latitude,
      longitude,
      kw: '',
    };
    return this.http.get('/shopping/v1/restaurants/activity_attributes', {
      params,
    });
  }

  /* 获取shop页面商铺详情 */
  getShopDetails(shopId: string, latitude: string, longitude: string): any {
    const params = {
      latitude,
      longitude,
      'extras[]': [
        'activities',
        'album',
        'license',
        'identification',
        'statistics',
      ],
    };
    return this.http.get('/shopping/restaurant/' + shopId, { params });
  }

  // 获取shop页面菜单列表
  getFoodMenu(restaurantId): any {
    const params = {
      restaurant_id: restaurantId,
    };
    return this.http.get('/shopping/v2/menu', { params });
  }
}
