import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { World, Pallier, Product } from '../../models/world';

@Injectable({
  providedIn: 'root',
})
export class RestserviceService {
  private _server = 'http://localhost:8080';
  private _user = '';

  constructor(private http: HttpClient) {}

  get user(): string {
    return this._user;
  }

  set user(user: string) {
    this._user = user;
  }

  get server(): string {
    return this._server;
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

  getWorld(): Promise<World> {
    return this.http
      .get(this.server + '/adventureisis/generic/world', {
        headers: this.setHeaders(this._user),
      })
      .toPromise()
      .catch(this.handleError);
  }

  putManager(manager: Pallier): Promise<Response> {
    return this.http
      .put(this.server + '/adventureisis/generic/manager', manager, {
        headers: this.setHeaders(this._user),
      })
      .toPromise()
      .catch(this.handleError);
  }

  putProduct(product: Product): Promise<Response> {
    return this.http
      .put(this.server + '/adventureisis/generic/product', product, {
        headers: this.setHeaders(this._user),
      })
      .toPromise()
      .catch(this.handleError);
  }

  putUpgrade(upgrade: Pallier): Promise<Response> {
    return this.http
      .put(this.server + '/adventureisis/generic/upgrade', upgrade, {
        headers: this.setHeaders(this._user),
      })
      .toPromise()
      .catch(this.handleError);
  }

  putAngelUpgrade(upgrade: Pallier): Promise<Response> {
    return this.http
      .put(this.server + '/adventureisis/generic/angelupgrade', upgrade, {
        headers: this.setHeaders(this._user),
      })
      .toPromise()
      .catch(this.handleError);
  }

  deleteWorld(): Promise<Response> {
    return this.http
      .delete(this.server + '/adventureisis/generic/world', {
        headers: this.setHeaders(this._user),
      })
      .toPromise()
      .catch(this.handleError);
  }

  private setHeaders(user: string): HttpHeaders {
    return new HttpHeaders({ 'X-User': user });
  }
}
