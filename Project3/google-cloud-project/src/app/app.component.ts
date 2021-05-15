import { Component, OnInit } from '@angular/core';
import { GoogleObj, GoogleService } from './google.services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  //Translate
  public googleObj: GoogleObj = new GoogleObj();
  public key: string = 'AIzaSyD9EyBKBy4ZrXI42wOcVY6siGca-_O9EmU';
  public result = '';
  private btnSubmit: any;

  constructor(private _google: GoogleService,) { }

  ngOnInit() {
    this.googleObj.source = 'en';
    this.googleObj.target = 'es';
    this.btnSubmit = document.getElementById('btnSubmit');
  }

  send() {
    this.btnSubmit.disabled = true;
    this._google.translate(this.googleObj, this.key).subscribe(
      (res: any) => {
        this.btnSubmit.disabled = false;
        this.result = res.data.translations[0].translatedText;
        console.log(this.googleObj.source,this.googleObj.target,res.data.translations[0].translatedText);

      },
      err => {
        console.log(err);
      }
    );
  }

}
