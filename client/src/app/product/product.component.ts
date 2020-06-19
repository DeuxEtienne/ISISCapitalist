import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Product, Pallier } from '../models/world';
import { RestserviceService } from '../services/restservice/restservice.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  progressbarvalue = 0;
  lastupdate: number;

  @Input()
  set product(value: Product) {
    this._product = value;
    this.lastupdate = Date.now();
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

  @Input()
  set managerUnlocked(value: boolean) {
    if (value) this._product.managerUnlocked = value;
  }

  @Output() startProduction: EventEmitter<Product> = new EventEmitter<
    Product
  >();

  @Output() notifyProduction: EventEmitter<Product> = new EventEmitter<
    Product
  >();

  @Output() onBuy: EventEmitter<{
    amount: Number;
    p: Product;
  }> = new EventEmitter<{
    amount: Number;
    p: Product;
  }>();

  constructor(private snackBar: MatSnackBar) {}

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
    if (!this._product.managerUnlocked) {
      this.startProduction.emit(this._product);
    }
  }

  calcScore(): void {
    if (this._product.timeleft > 0) {
      this._product.timeleft =
        this._product.timeleft - (Date.now() - this.lastupdate);
      this.lastupdate = Date.now();
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
    } else if (this._product.managerUnlocked) {
      this.startFabrication();
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
    let prix: number;
    switch (this._qtmulti) {
      case 1:
        prix = this._product.cout;
        this._product.quantite += 1;
        this._product.cout = this._product.cout * this._product.croissance;
        break;
      case 10:
        prix = this.getPrix(10);
        this._product.quantite += 10;
        this._product.cout =
          this._product.cout * this._product.croissance ** 10;
        break;
      case 100:
        prix = this.getPrix(100);
        this._product.quantite += 100;
        this._product.cout =
          this._product.cout * this._product.croissance ** 100;
        break;
      case 0:
        let qtt = this.calcMaxCanBuy();
        prix = this.getPrix(qtt);
        this._product.quantite += qtt;
        this._product.cout =
          this._product.cout * this._product.croissance ** qtt;
        break;
    }
    this.onBuy.emit({ amount: prix, p: this._product });
    this._product.palliers.pallier.forEach((p) => {
      if (!p.unlocked && p.seuil<=this._product.quantite) {
        this.calcUpgrade(p);
        this.snackBar.open(
          'You just unlocked the ' + this._product.name + ' upgrade ' + p.name,
          '',
          {
            duration: 4000,
          }
        );
      }
    });
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

  calcUpgrade(p: Pallier): void {
    // Si le seuil du pallier est dépassé, on met à jour le produit
    if (p.seuil <= this._product.quantite) {
      switch (p.typeratio) {
        case 'vitesse':
          this._product.vitesse = this._product.vitesse / p.ratio;
          this._product.timeleft = this._product.timeleft / p.ratio;
          break;
        case 'gain':
          this._product.revenu = this._product.revenu * p.ratio;
          break;
      }
      p.unlocked = true;
    }
  }
}
