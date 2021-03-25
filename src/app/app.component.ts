import { Component } from '@angular/core';

const LOADING_TIME = 2500;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public loading:boolean = true;

  constructor(){
    this.loadingSpinner();
  }

  public loadingSpinner(){
    setTimeout(() => {
      this.loading = false;
    }, LOADING_TIME);
  }
}
