import { Component } from '@angular/core';
import { World, Product, Pallier } from './models/world';
import { RestserviceService } from './services/restservice/restservice.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  world: World = new World();
  server: string;
  qtmulti: number = 1;
  showManagers = false;
  badgeManagers = 0;
  username: string;

  constructor(
    private service: RestserviceService,
    private snackBar: MatSnackBar
  ) {
    this.server = service.server;
    this.username = localStorage.getItem('username');
    if (this.username == null) {
      this.username = Math.floor(Math.random() * 1000000000).toString();
      localStorage.setItem('username', this.username);
    }

    this.onUsernameChanged();

    service.getWorld().then((world) => {
      this.world = world;
    });
  }

  onStartProduction(p: Product): void {
    this.service.putProduct(p);
  }

  onProductionDone(p: Product): void {
    let prod = p.revenu * p.quantite;
    this.world.money += prod;
    this.world.score += prod;
    this.badgeManagers = 0;
    for (let manager of this.world.managers.pallier) {
      if (manager.seuil < this.world.money && !manager.unlocked) this.badgeManagers += 1;
    }
  }

  calcQtMulti(): void {
    switch (this.qtmulti) {
      case 1:
        this.qtmulti = 10;
        break;
      case 10:
        this.qtmulti = 100;
        break;
      case 100:
        this.qtmulti = 0;
        break;
      case 0:
        this.qtmulti = 1;
        break;
      default:
        this.qtmulti = 1;
    }
  }

  onBuy(obj: {amount: number, p: Product}): void {
    if (this.world.money >= obj.amount){
      this.world.money -= obj.amount;
      this.service.putProduct(obj.p);
    }
  }

  hireManager(manager: Pallier): void {
    if (this.world.money < manager.seuil) {
      return;
    }
    this.world.money -= manager.seuil;
    manager.unlocked = true;
    this.world.products.product[manager.idcible].managerUnlocked = true;
    this.snackBar.open(manager.name + ' just joinned your universe', '', {
      duration: 4000,
    });

    this.service.putManager(manager);
  }

  onUsernameChanged(): void {
    this.service.user = this.username;
  }
}
