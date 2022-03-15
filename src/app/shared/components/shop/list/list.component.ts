import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  @Input() shopList: any;
  @Input() type: string;
  @Input() geohash: string;

  constructor() {}

  ngOnInit() {}
}
