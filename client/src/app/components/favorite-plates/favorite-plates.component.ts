import { Component, OnInit } from '@angular/core';
import { Plate } from 'src/app/models/plate.model';
import { ConfigService } from 'src/app/services/config.service';
import { FavoriteService } from 'src/app/services/favorite.service';
import { PlateService } from 'src/app/services/plate.service';

@Component({
  selector: 'app-favorite-plates',
  templateUrl: './favorite-plates.component.html',
  styleUrls: ['./favorite-plates.component.scss']
})
export class FavoritePlatesComponent implements OnInit {

  public plates: Plate[] = [];
  public showAvailableOnly: boolean = null;

  constructor(
    private _ps: PlateService,
    private _fs: FavoriteService,
    private _cfs: ConfigService
  ) {

    const platesToFind = this._fs.getFavorites();
    const selectedState = this._cfs.getState();

    console.log("Favorites are ", platesToFind);

    this._ps.batchSearchById(platesToFind, selectedState).then((plates: Plate[]) => {
      this.plates = plates.map(plate => {
        return { ...plate, favorited: this._fs.contains(plate.id) };
      });
    });
  }

  ngOnInit(): void {
  }
}
