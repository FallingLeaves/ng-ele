import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalstorageService {
  constructor() {}

  getStore(name: string) {
    if (!name) {
      return;
    }
    return window.localStorage.getItem(name);
  }

  setStore(name: string, content: any) {
    if (!name) {
      return;
    }
    if (typeof content !== 'string') {
      content = JSON.stringify(content);
    }
    window.localStorage.setItem(name, content);
  }

  removeStore(name: string) {
    if (!name) {
      return;
    }
    window.localStorage.removeItem(name);
  }
}
