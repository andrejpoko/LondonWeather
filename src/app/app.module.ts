import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { HeatIndexTabComponent } from './navigation-tabs/heat-index-tab/heat-index-tab.component';
import { LineChartTabComponent } from './navigation-tabs/line-chart-tab/line-chart-tab.component';
import { WeatherConditionsTabComponent } from './navigation-tabs/weather-conditions-tab/weather-conditions-tab.component';
import { WeatherTableComponent } from './navigation-tabs/weather-conditions-tab/weather-table/weather-table.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    WeatherConditionsTabComponent,
    LineChartTabComponent,
    HeatIndexTabComponent,
    WeatherTableComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    MatTabsModule,
    RouterModule,
    MatTableModule,
    MatExpansionModule,
    HttpClientModule,
    CommonModule,
  ],
  providers: [provideAnimationsAsync()],
  bootstrap: [AppComponent],
})
export class AppModule {}
