import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    public donateUrl: string = "https://www.paypal.com/donate/?hosted_button_id=JNXHFT9F6FUUJ";

    constructor() { }

    ngOnInit(): void {
    }

    public handleDonateClick(): void {
        window.open(this.donateUrl, "_blank");
    }

}
