import { Component, OnInit, Input } from '@angular/core';
import { PlateService } from '../../services/plate.service';
import { FavoriteService } from '../../services/favorite.service'; 
import { DatetimeService } from '../../services/datetime.service';
import { Plate } from 'src/app/models/plate.model';

import * as moment from 'moment';

@Component({
  selector: 'app-plate',
  templateUrl: './plate.component.html',
  styleUrls: ['./plate.component.scss']
})
export class PlateComponent implements OnInit {

  @Input('plate') plate: Plate;

  public checkingAvailability: boolean = false;
  public moment: any = moment;

  public state: string;

  constructor(
    private _ps: PlateService,
    private _fs: FavoriteService,
    public dts: DatetimeService
  ) { }

  ngOnInit(): void {
    this.state = this.plate.state;
    console.log(JSON.stringify(this.plate));
  }

  public toggleFavorite(plate: Plate): void {
    console.log(`Trying to favorite ${plate.id}.`);
    plate.favorited = !plate.favorited;
    this._fs.toggleFavorite(plate.id);
  }

  public async checkAvailability(plate: Plate): Promise<void> {
    this.checkingAvailability = true;
    let determination = await this._ps.getAvailability(plate.id, this.state);
    this.checkingAvailability = false;
    console.log(determination);
    plate.available = determination.isAvailable;
  }

}
