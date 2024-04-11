import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { FooterComponent } from './footer/footer.component';
import { HeatIndexTabComponent } from './navigation-tabs/heat-index-tab/heat-index-tab.component';
import { WeatherConditionsTabComponent } from './navigation-tabs/weather-conditions-tab/weather-conditions-tab.component';
import { WeatherTableComponent } from './navigation-tabs/weather-conditions-tab/weather-table/weather-table.component';
import { MatListModule } from '@angular/material/list';
import { HeatIndexStorageComponent } from './navigation-tabs/heat-index-tab/heat-index-storage/heat-index-storage.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    WeatherConditionsTabComponent,
    HeatIndexTabComponent,
    WeatherTableComponent,
    HeatIndexStorageComponent
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
    ReactiveFormsModule,
    MatInputModule,
    MatRadioModule,
    MatButtonModule,
    MatProgressBarModule,
    MatDividerModule,
    MatListModule,
  ],
  providers: [
    provideCharts(withDefaultRegisterables()),
    provideAnimationsAsync(),
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
