import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable()
export class GoogleService {
  constructor(private _http: HttpClient, private firestore: AngularFirestore) {}

  translate(obj: GoogleObj, key: string) {
    return this._http.post(url + key, obj);
  }

  getChannels(channelName:string): Observable<any>{
    var apiKey = "AIzaSyD9EyBKBy4ZrXI42wOcVY6siGca-_O9EmU";
    var localUrl = "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + channelName + "&type=channel&key=" + apiKey + "&maxResults50";
    return this._http.get<any>(localUrl);
  }

  getUsers() {
    return this.firestore.collection('users').snapshotChanges();
  }

  createUser(user: User){
    return this.firestore.collection('users').add(user);
  }

  updateUser(user: User){
    this.firestore.doc('users/' + user.id).update(user);
  }

  deleteUser(userId: string){
    this.firestore.doc('users/' + userId).delete();
}
}

const url = 'https://translation.googleapis.com/language/translate/v2?key=';

export class GoogleObj {
  q: string;
  source: string;
  target: string;
  readonly format: string = 'text';

  constructor() {}
}

export class User {
  id: string;
  name: string;
  age: number;
}

