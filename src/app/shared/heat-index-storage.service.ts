import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HeatIndexStorageService {
  private _heatIndexStorage = 'heatIndexStore';

  constructor() {}

  loadStorage(): string[] {
    return JSON.parse(localStorage.getItem(this._heatIndexStorage) || '[]');
  }

  saveIndexToStorage(newHeatIndex: string): void {
    const maxEntries = 5;
    const indexHistory: string[] = JSON.parse(
      localStorage.getItem(this._heatIndexStorage) || '[]'
    );

    indexHistory.unshift(newHeatIndex);

    while (indexHistory.length > maxEntries) {
      indexHistory.pop();
    }
    localStorage.setItem(this._heatIndexStorage, JSON.stringify(indexHistory));
  }
}
