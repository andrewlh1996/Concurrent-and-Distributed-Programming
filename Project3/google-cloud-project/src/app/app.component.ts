import { MapsAPILoader } from '@agm/core';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { GoogleObj, GoogleService, User } from './google.services';

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

  //Maps
  title: string = 'AGM project';
  latitude: number;
  longitude: number;
  zoom: number;
  address: string;
  private geoCoder;
  @ViewChild('search')
  public searchElementRef: ElementRef;

  //Youtube
  @ViewChild('channelName') channelName: ElementRef;
  channels: any;

  //Firestore
  @ViewChild('name') name: ElementRef;
  @ViewChild('age') age: ElementRef;
  users: User[];

  constructor(private _google: GoogleService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone) { }

  ngOnInit() {
    //Translate
    this.googleObj.source = 'en';
    this.googleObj.target = 'es';
    this.btnSubmit = document.getElementById('btnSubmit');

    //Maps
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;
    });

    //Firestore
    this._google.getUsers().subscribe(data => {
      this.users = data.map( e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as any
        } as User;
      })
      console.log(this.users);

    });
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

  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 8;
        this.getAddress(this.latitude, this.longitude);
      });
    }
  }

  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.address = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }

  getChannels(channel:string) {
    this._google.getChannels(channel).subscribe(x => {
      console.log(x);
      this.channels = x.items;
    });
  }

  delete(userId) {
    this._google.deleteUser(userId);
  }

  update(user:User) {
    user.age = +user.age;
    this._google.updateUser(user);
  }

  add() {
    var user = {name: this.name.nativeElement.value, age: +this.age.nativeElement.value} as User;
    this._google.createUser(user);
  }

}
