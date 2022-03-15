import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-rating-star',
  templateUrl: './rating-star.component.html',
  styleUrls: ['./rating-star.component.scss'],
})
export class RatingStarComponent implements OnInit {
  @Input() rating: number;

  constructor() {}

  ngOnInit() {}
}
