import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { Plate } from '../models/plate.model';

import * as querystring from 'querystring';

export enum SearchType {
    BEGINS_WITH = 'BEGINS_WITH',
    ENDS_WITH = 'ENDS_WITH',
    EXACTLY = 'EXACTLY',
    LIKE = 'LIKE'
}

export type PlateQuery = {
    state: string;
    available?: boolean;
    searchType: SearchType;
    searchValue: string;
};

@Injectable({
  providedIn: 'root'
})
export class PlateService {

  constructor(private _http: HttpClient) { }

  public search(query: PlateQuery): Promise<Plate[]> {

    return this._http.get<Plate[]>(
      `${environment.apiUrl}/plate?${querystring.stringify(query)}`
    ).toPromise();
  }

  public batchSearchById(ids: string[], state: string): Promise<Plate[]> {
    return this._http.post<Plate[]>(
      `${environment.apiUrl}/batch/plate`,
      {
          plates: ids,
          state: state
      }
    ).toPromise();
  }

  public getRandomPlates(state: string, limit: number, available?: boolean): Promise<Plate[]> {

    let queryString = `limit=${limit}&state=${state}`;
    if(available != undefined) queryString += `&available=${available}`;

    return this._http.get<Plate[]>(
      `${environment.apiUrl}/random?${queryString}`
    ).toPromise();
  }

  public getAvailability(id: string, state: string): Promise<{isAvailable: boolean}> {
    return this._http.post<{isAvailable: boolean}>(
      `${environment.apiUrl}/check/${state}/${id}`,
      null
    ).toPromise();
  }


}
