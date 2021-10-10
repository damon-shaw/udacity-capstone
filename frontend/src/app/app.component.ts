import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'PlateSearcher';

  public isCollapsed: boolean = true;

  constructor() {}

  public toggleMobileNavbarCollapsed(): void {
      console.log("Toggling the navbar!");
      this.isCollapsed = !this.isCollapsed;
  }
}
