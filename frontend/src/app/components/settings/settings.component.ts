import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { ConfigService } from 'src/app/services/config.service';

import { State } from '../../services/config.service';

import * as _ from 'lodash';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

    public dropdownOptions: SelectItem[] = [];
    public selectedState: string;

    constructor(
        private _ecs: ConfigService
    ) { }

    ngOnInit(): void {
        this._ecs.getSupportedStates().then((states: State[]) => {
            console.log(states);
            this.dropdownOptions = states.map(el => {
                return {
                    label: el.name,
                    value: el.abbreviation
                };
            });

            console.log(this.dropdownOptions);

            console.log(this._ecs.getState());
            this.selectedState = this._ecs.getState();
            console.log(this.selectedState);
        });
    }

    public handleStateSelected(event: any): void {
        console.log('Changing the configured state!');
        this._ecs.setState(event.value);
    }

}
