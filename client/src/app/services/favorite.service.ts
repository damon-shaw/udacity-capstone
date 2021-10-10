import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  constructor() { }

  public addFavorite(item: string): void {
    let currentFavorites: string[] = JSON.parse(localStorage.getItem('favorites'));

    if(currentFavorites === undefined || currentFavorites === null)
      currentFavorites = [];
    else
      currentFavorites.push(item);

    localStorage.setItem('favorites', JSON.stringify(currentFavorites));
  }

  public removeFavorite(item: string): void {
    let currentFavorites: string[] = JSON.parse(localStorage.getItem('favorites'));

    if(currentFavorites === undefined || currentFavorites === null)
      currentFavorites = [];
    else {
      while(currentFavorites.indexOf(item) !== -1)
        currentFavorites.splice(currentFavorites.indexOf(item));
    }

    localStorage.setItem('favorites', JSON.stringify(currentFavorites));
  }

  public toggleFavorite(item: string): void {
    if(this.contains(item)) this.removeFavorite(item);
    else this.addFavorite(item);
  }

  public contains(item: string): boolean {
    let currentFavorites: string[] = JSON.parse(localStorage.getItem('favorites'));

    if(currentFavorites === undefined || currentFavorites === null)
      return false;
    else {
      return currentFavorites.indexOf(item) >= 0;
    }
  }

  public getFavorites(): string[] {
    return JSON.parse(localStorage.getItem('favorites'));
  }
}
