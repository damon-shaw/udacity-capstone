import { Injectable } from '@angular/core';

import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DatetimeService {

  constructor() { }

  public longDatetime(datetime: string): string {
    return moment(datetime).format("MMM Do YYYY, h:mm A")
  }


}
