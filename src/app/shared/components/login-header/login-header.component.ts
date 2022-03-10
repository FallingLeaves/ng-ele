import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AppService, LocalstorageService } from '../../../services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login-header',
  templateUrl: './login-header.component.html',
  styleUrls: ['./login-header.component.scss'],
})
export class LoginHeaderComponent implements OnInit, OnDestroy {
  userId: string;
  unSubEvent: Subscription;

  constructor(
    public appService: AppService,
    public localstorageService: LocalstorageService,
    public router: Router
  ) {
    this.userId = this.localstorageService.getStore('userId');
    this.unSubEvent = this.appService.userInfoEvent.subscribe((res) => {
      this.userId = this.localstorageService.getStore('userId');
    });
  }

  ngOnInit() {}

  ngOnDestroy(): void {
    if (this.unSubEvent) {
      this.unSubEvent.unsubscribe();
    }
  }

  toProfile() {
    // this.router.navigateByUrl('/tabs/profile');
  }
}
