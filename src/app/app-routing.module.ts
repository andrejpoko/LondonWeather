import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeatIndexTabComponent } from './navigation-tabs/heat-index-tab/heat-index-tab.component';
import { LineChartTabComponent } from './navigation-tabs/line-chart-tab/line-chart-tab.component';
import { WeatherConditionsTabComponent } from './navigation-tabs/weather-conditions-tab/weather-conditions-tab.component';

const routes: Routes = [
  { path: '', redirectTo: 'weather', pathMatch: 'full' },
  { path: 'weather', component: WeatherConditionsTabComponent },
  { path: 'line-chart', component: LineChartTabComponent },
  { path: 'heat-index', component: HeatIndexTabComponent },
  // { path: '**', redirectTo: '/weather' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
