import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-heat-index-storage',
  templateUrl: './heat-index-storage.component.html',
  styleUrls: ['./heat-index-storage.component.css'],
})
export class HeatIndexStorageComponent implements OnInit {
  @Input() data?: string[];

  constructor() {}

  ngOnInit() {}
}
