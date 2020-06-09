import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { World, Pallier, Product } from '../../models/world';

@Injectable({
  providedIn: 'root',
})
export class RestserviceService {
  private _server = 'http://localhost:8080/';
  private _user = '';

  constructor(private http: HttpClient) {}

  get user(): string {
    return this._user
  }

  set user(user: string) {
    this._user = user
  }

  get server(): string {
    return this._server
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
  
  getWorld(): Promise<World> {
    return this.http
      .get(this.server + "adventureisis/generic/world")
      .toPromise()
      .catch(this.handleError);
  }
}
