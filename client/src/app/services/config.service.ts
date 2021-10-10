import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AllowableCharacters } from '../models/allowable-characters.model';

import { environment } from 'src/environments/environment';

const STATE_KEY: string = "STATE";
const ALLOWABLE_CHARS_KEY: string = "ALLOWABLE_CHARS";

export interface State {
    name: string;
    abbreviation: string;
}

@Injectable({
    providedIn: 'root'
})
export class ConfigService {

    private selectedState: string;
    private allowableCharacters: string;

    constructor(
        private _http: HttpClient
    ) {}

    public async init(): Promise<void> {
        // Check the local storage to see if a state has already been selected.
        // If there isn't one in local storage, default to Virginia.
        if(!localStorage.getItem(STATE_KEY))
            this.setState('VA');
        else
            this.selectedState = localStorage.getItem(STATE_KEY);

        console.log("Starting the configuration service!");
    }

    public setState(state: string): void {
        // Set the selected state in local storage.
        localStorage.setItem(STATE_KEY, state);

        this.selectedState = state;

        // Retrieve the allowable chara
        this.getAllowableCharacters();
    }

    public getState(): string {
        return localStorage.getItem(STATE_KEY);
    }

    public getSupportedStates(): Promise<State[]> {
        return this._http.get<State[]>(
            `${environment.apiUrl}/state/supported`
        ).toPromise();
    }

    public getAllowableCharacters(): Promise<string> {
        if(this.allowableCharacters)
            return Promise.resolve(this.allowableCharacters);

        return this._http.get<AllowableCharacters>(
            `${environment.apiUrl}/state/${this.selectedState}/charset`
        )
        .toPromise()
        .then((response: AllowableCharacters) => {
            this.allowableCharacters = response.charset;
            return this.allowableCharacters;
        });
    }

}
