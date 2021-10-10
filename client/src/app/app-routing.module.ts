import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { RandomPlatesComponent } from './components/random-plates/random-plates.component';
import { SearchPlatesComponent } from './components/search-plates/search-plates.component';
import { FavoritePlatesComponent } from './components/favorite-plates/favorite-plates.component';
import { SettingsComponent } from './components/settings/settings.component';

const routes: Routes = [
  {
    path: '', redirectTo: '/home', pathMatch: 'full'
  },
  {
    path: 'home', component: HomeComponent, data: { }
  },
  {
    path: 'unavailable', component: RandomPlatesComponent, data: { available: false }
  },
  {
    path: 'available', component: RandomPlatesComponent, data: { available: true }
  },
  {
    path: 'random', component: RandomPlatesComponent, data: { }
  },
  {
    path: 'search', component: SearchPlatesComponent, data: { }
  },
  {
    path: 'favorites', component: FavoritePlatesComponent, data: { }
  },
  {
    path: 'settings', component: SettingsComponent, data: { }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
