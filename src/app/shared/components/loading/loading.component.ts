import { Component, OnInit, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit, OnDestroy {
  timer: Subscription;
  positionY: number = 0;

  constructor() {
    this.timer = interval(600).subscribe(() => {
      this.positionY++;
    });
  }

  ngOnInit() {}

  ngOnDestroy(): void {
    if (this.timer) {
      this.timer.unsubscribe();
    }
  }
}
