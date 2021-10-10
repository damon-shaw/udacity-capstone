import { Component, OnInit } from '@angular/core';
import { PlateService } from '../../services/plate.service';
import { FavoriteService } from '../../services/favorite.service';
import { Plate } from 'src/app/models/plate.model';
import { ActivatedRoute } from '@angular/router';
import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'app-random-plates',
  templateUrl: './random-plates.component.html',
  styleUrls: ['./random-plates.component.scss']
})
export class RandomPlatesComponent implements OnInit {

  public plates: Plate[];
  public showAvailableOnly: boolean = null;

  constructor(
    private _ps: PlateService,
    private _fs: FavoriteService,
    private _cs: ConfigService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log(this.route.snapshot.data);
    let state = this._cs.getState();
    this._ps.getRandomPlates(state, 9, this.route.snapshot.data['available']).then((plates: Plate[]) => {
      this.plates = plates.map(plate => {
        return { ...plate, favorited: this._fs.contains(plate.id) };
      });
      console.log(this.plates);
    });
  }

}
