import { Component, OnInit } from '@angular/core';
import
  {
    AbstractControl,
    FormBuilder,
    FormGroup,
    ValidationErrors,
    Validators,
  } from '@angular/forms';
import { Subject, distinctUntilChanged, takeUntil } from 'rxjs';
import { HeatIndexStorageService } from '../../shared/heat-index-storage.service';

@Component({
  selector: 'app-heat-index-tab',
  templateUrl: './heat-index-tab.component.html',
  styleUrls: ['./heat-index-tab.component.css'],
})
export class HeatIndexTabComponent implements OnInit {
  heatIndexForm: FormGroup;
  heatIndex: number | null = null;
  resultUnit: 'C' | 'F' | undefined;
  heatIndexHistory: string[] = [];
  lastResult?: string;
  private unsubscribe$: Subject<void> = new Subject();

  constructor(private fb: FormBuilder,
    private heatIndexStorageService: HeatIndexStorageService
  ) {
    this.heatIndexForm = this.fb.group(
      { temperature: ['', [Validators.required, Validators.pattern('^[-]?[0-9]*$')]],
        temperatureUnit: ['C'],
        humidity: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      }, { validators: this.temperatureValidator }
    );
  }

  ngOnInit() {
    this.heatIndexHistory = this.heatIndexStorageService.loadStorage();

    this.heatIndexForm.get('temperature')?.valueChanges.pipe(
      distinctUntilChanged(),
      takeUntil(this.unsubscribe$)
    ).subscribe(() => {
      this.heatIndexForm.get('temperature')?.updateValueAndValidity();
    })

  }

  calculateHeatIndex() {
    const formValue = this.heatIndexForm.value;
    let temperature = formValue.temperature;
    const humidity = formValue.humidity;
    const tempUnit = formValue.temperatureUnit;
    let temperatureF = tempUnit === 'C' ? this.convertCtoF(temperature) : temperature;

    if (temperatureF < 80 || humidity < 0) {
      this.heatIndex = null;
      return;
    }

    let heatIndexF =
      -42.379 +
      2.04901523 * temperatureF +
      10.14333127 * humidity -
      0.22475541 * temperatureF * humidity -
      0.00683783 * temperatureF ** 2 -
      0.05481717 * humidity ** 2 +
      0.00122874 * temperatureF ** 2 * humidity +
      0.00085282 * temperatureF * humidity ** 2 -
      0.00000199 * temperatureF ** 2 * humidity ** 2;

    this.heatIndex = tempUnit === 'C' ? this.convertFtoC(heatIndexF) : heatIndexF;
    this.resultUnit = tempUnit;

    // Local storage
    this.lastResult = `${this.heatIndex.toFixed(1)} °${this.resultUnit}`;
    this.heatIndexStorageService.saveIndexToStorage(this.lastResult);
    this.heatIndexHistory = this.heatIndexStorageService.loadStorage();
  }

  private convertCtoF(celsius: number): number {
    return (celsius * 9) / 5 + 32;
  }

  private convertFtoC(fahrenheit: number): number {
    return ((fahrenheit - 32) * 5) / 9;
  }

  temperatureValidator(control: AbstractControl): ValidationErrors | null {
    const temperature = control.get('temperature')?.value;
    const temperatureUnit = control.get('temperatureUnit')?.value;

    if (temperature === null || temperature === '' || isNaN(temperature)) {
      return null;
    }

    let isValid = true;
    if (temperatureUnit === 'C') {
      isValid = temperature >= 26.7;
    } else if (temperatureUnit === 'F') {
      isValid = temperature >= 80;
    }

    return isValid ? null : { temperatureBelowThreshold: true };
  }
}
