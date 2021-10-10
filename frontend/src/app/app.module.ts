import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { ConfigService } from '../app/services/config.service';

import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputTextModule } from 'primeng/inputtext';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { DialogModule } from 'primeng/dialog';
import { KeyFilterModule } from 'primeng/keyfilter';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlateComponent } from './components/plate/plate.component';
import { RandomPlatesComponent } from './components/random-plates/random-plates.component';
import { SearchPlatesComponent } from './components/search-plates/search-plates.component';
import { HomeComponent } from './components/home/home.component';
import { FavoritePlatesComponent } from './components/favorite-plates/favorite-plates.component';
import { SettingsComponent } from './components/settings/settings.component';
import { NoneFoundBannerComponent } from './components/none-found-banner/none-found-banner.component';

@NgModule({
  declarations: [
    AppComponent,
    PlateComponent,
    RandomPlatesComponent,
    SearchPlatesComponent,
    HomeComponent,
    FavoritePlatesComponent,
    SettingsComponent,
    NoneFoundBannerComponent
  ],
  imports: [
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    DropdownModule,
    InputTextModule,
    AutoCompleteModule,
    ProgressSpinnerModule,
    ProgressBarModule,
    TriStateCheckboxModule,
    DialogModule,
    KeyFilterModule,

    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
      AppComponent,
      {
          provide: APP_INITIALIZER,
          useFactory: (service: ConfigService) => function() { return service.init(); },
          deps: [ConfigService],
          multi: true
      }
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
