import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../models/world';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  private _product: Product;
  private _qtmulti: number;
  private _wmoney: number;
  private _server: string;
  progressbarvalue: number;
  lastupdate: number;

  @Input()
  set product(value: Product) {
    this._product = value;
  }

  get product(): Product {
    return this._product;
  }

  @Input()
  set qtmulti(value: number) {
    this._qtmulti = value;
    if (this._qtmulti && this._product) this.calcMaxCanBuy();
  }

  get qtmulti(): number {
    return this._qtmulti;
  }

  @Input()
  set wmoney(value: number) {
    this._wmoney = value;
  }

  @Input()
  set server(value: string) {
    this._server = value;
  }

  get server(): string {
    return this._server;
  }

  @Output() notifyProduction: EventEmitter<Product> = new EventEmitter<
    Product
  >();

  @Output() onBuy: EventEmitter<Number> = new EventEmitter<Number>();

  constructor() {}

  ngOnInit(): void {
    setInterval(() => {
      this.calcScore();
      this.calcCanBuy();
    }, 100);
  }

  startFabrication(): void {
    if (this._product.timeleft > 0 || this._product.quantite == 0) {
      return;
    }
    this._product.timeleft = this._product.vitesse;
    this.lastupdate = Date.now();
  }

  calcScore(): void {
    if (this._product.timeleft > 0) {
      this._product.timeleft =
        this._product.timeleft - (Date.now() - this.lastupdate);
      console.log(this._product.timeleft);
      if (this._product.timeleft <= 0) {
        if (this._product.managerUnlocked) {
          this.startFabrication();
        } else {
          this._product.timeleft = 0;
          this.progressbarvalue = 0;
        }
        this.notifyProduction.emit(this._product);
      } else {
        this.progressbarvalue =
          ((this._product.vitesse - this._product.timeleft) /
            this._product.vitesse) *
          100;
      }
    }
  }

  calcCanBuy(): number {
    let max = this.calcMaxCanBuy();
    if (this._qtmulti != 0) {
      if (max >= this._qtmulti) {
        return this._qtmulti;
      }
    } else {
      if (max >= 1) {
        return max;
      }
    }
    return 0;
  }

  buy(): void {
    switch (this._qtmulti) {
      case 1:
        this.onBuy.emit(this._product.cout);
        this._product.quantite += 1;
        this._product.cout = this._product.cout * this._product.croissance;
        break;
      case 10:
        this.onBuy.emit(this.getPrix(10));
        this._product.quantite += 10;
        this._product.cout =
          this._product.cout * this._product.croissance ** 10;
        break;
      case 100:
        this.onBuy.emit(this.getPrix(100));
        this._product.quantite += 10;
        this._product.cout =
          this._product.cout * this._product.croissance ** 10;
        break;
      case 0:
        let qtt = this.calcMaxCanBuy();
        this.onBuy.emit(this.getPrix(qtt));
        this._product.quantite += qtt;
        this._product.cout =
          this._product.cout * this._product.croissance ** qtt;
        break;
    }
  }

  calcMaxCanBuy(): number {
    return Math.floor(
      Math.log(
        -(
          this._wmoney / this._product.cout -
          1 / (1 - this._product.croissance)
        ) *
          (1 - this._product.croissance)
      ) / Math.log(this._product.croissance)
    );
  }

  getPrix(quantite: number) {
    return (
      (this._product.cout * (1 - this._product.croissance ** quantite)) /
      (1 - this._product.croissance)
    );
  }
}
