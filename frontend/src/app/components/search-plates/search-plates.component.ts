import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { SelectItem } from 'primeng/api';
import { StatusCodes } from 'http-status-codes';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';

import { Plate } from 'src/app/models/plate.model';
import { SearchType, PlateService } from 'src/app/services/plate.service';
import { ConfigService } from 'src/app/services/config.service';
import { SERVICE_UNAVAILABLE_MSG } from 'src/app/common/messages';

@Component({
    selector: 'app-search-plates',
    templateUrl: './search-plates.component.html',
    styleUrls: ['./search-plates.component.scss']
})
export class SearchPlatesComponent implements OnInit {

    public searchTypeOptions: SelectItem[] = [
        { label: 'Begins With', value: 'BEGINS_WITH' },
        { label: 'Ends With', value: 'ENDS_WITH' },
        { label: 'Exactly', value: 'EXACTLY' },
        { label: 'Like (Contains)', value: 'LIKE' }
    ];

    public searchEntry: string;
    public allowableCharacters: RegExp = /^\w*$/;
    public plates: Plate[] = [];

    public hasQueryBeenSearched: boolean = false;
    public isSearching: boolean = false;
    public isChecking: boolean = false;

    public errorModalVisible: boolean = false;
    public errorText: string;

    public form: FormGroup = this._fb.group({
        searchType: [SearchType.BEGINS_WITH],
        searchValue: [''],
        isAvailable: [undefined]
    });

    constructor(
        private _ps: PlateService,
        private _cfs: ConfigService,
        private _fb: FormBuilder
    ) { }

    async ngOnInit(): Promise<void> {
        let charset = await this._cfs.getAllowableCharacters();

        this.form.valueChanges
            .pipe(tap(() => {
                this.hasQueryBeenSearched = false;
            }))
            .pipe(debounceTime(500))
            .pipe(distinctUntilChanged())
            .subscribe(async data => {
                // Only search if a search value has been provided.
                if (data.searchValue.trim().length > 0) {
                    await this.search(data.searchType, data.searchValue, data.isAvailable);
                    this.hasQueryBeenSearched = true;
                }
            });

        if(charset)
            this.allowableCharacters = new RegExp(`^${charset}*$`);
    }

    public getAutocompleteOptions(): void {
        this.search(this.searchType, this.searchValue, this.isAvailable);
    }

    public async search(searchType: SearchType, searchValue: string, isAvailable: boolean | undefined): Promise<void> {
        this.isSearching = true;
        console.log(searchType, searchValue, isAvailable);

        try {
            this.plates = await this._ps.search({
                state: this._cfs.getState(),
                available: isAvailable,
                searchType: searchType,
                searchValue: searchValue
            });
        }
        catch(error) {
            console.log(error);
            switch (error.status) {
                case 0:
                    this.errorModalVisible = true;
                    this.errorText = SERVICE_UNAVAILABLE_MSG;
                    break;
                case StatusCodes.BAD_REQUEST:
                case StatusCodes.SERVICE_UNAVAILABLE:
                case StatusCodes.INTERNAL_SERVER_ERROR:
                    this.errorModalVisible = true;
                    this.errorText = error.error;
                    break;
            }
            console.log(error);
        }
        finally {
            console.log(this.plates);
            this.isSearching = false;
        }
    }

    public async checkAvailability(): Promise<void> {
        // Enable the loading indicator.
        this.isChecking = true;

        // Create an availability check for the entered plate.
        try {
            await this._ps.getAvailability(this.searchValue, this._cfs.getState());

            console.log('Search value is', this.searchValue);

            // After we've done that, do another search for the query as
            // it should include the newly checked plate.
            await this.search(this.searchType, this.searchValue, this.isAvailable);
        }
        catch (error) {
            switch (error.status) {
                case StatusCodes.BAD_REQUEST:
                case StatusCodes.SERVICE_UNAVAILABLE:
                case StatusCodes.INTERNAL_SERVER_ERROR:
                    this.errorModalVisible = true;
                    this.errorText = error.error;
                    break;
            }
            console.log(error);
        }
        finally {
            // Disable the loading indicator.
            this.isChecking = false;
        }
    }

    public get formData(): any {
        return this.form.value;
    }

    public get searchValue(): string {
        return this.formData.searchValue;
    }

    public get searchType(): SearchType {
        return this.formData.searchType;
    }

    public get isAvailable(): boolean {
        return this.formData.isAvailable;
    }

    public isQueryPopulated(): boolean {
        return this.formData.searchValue && this.formData.searchValue.length > 0;
    }

    public isResultsEmpty(): boolean {
        return this.hasQueryBeenSearched && this.plates.length === 0;
    }

    public isSearchEmpty(): boolean {
        return !this.isSearching && this.isQueryPopulated() && this.isResultsEmpty();
    }

}
