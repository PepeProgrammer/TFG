import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor() { }

  initializeAppTheaming() { // Para poder cambiar cosas en el tema en caso de que el modo sea claro
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)');
    this.toggleLightTheme(prefersLight.matches);
    prefersLight.addEventListener('change', (mediaQuery) => this.toggleLightTheme(mediaQuery.matches));
  }

  toggleLightTheme(shouldAdd: boolean) {
    document.body.classList.toggle('light', shouldAdd);
  }
}
