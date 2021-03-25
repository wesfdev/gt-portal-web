import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class CommonsService {

  constructor(private _snackBar: MatSnackBar) { }

  public alert(message: string, action?: string, config: MatSnackBarConfig = { duration: 2000}){
    this._snackBar.open(message, action, config);        
  }

  public snackBar(){
    return this._snackBar;
  }

}
