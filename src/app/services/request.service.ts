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
}
