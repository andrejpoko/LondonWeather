import { Component } from '@angular/core';
import { ProgressBarService } from './shared/progress-bar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  navLinks = [
    { label: 'Weather', path: '/weather' },
    { label: 'Line chart', path: '/line-chart' },
    { label: 'Heat index', path: '/heat-index' },
  ];
  
  constructor(public progressBarService: ProgressBarService) {}
}
