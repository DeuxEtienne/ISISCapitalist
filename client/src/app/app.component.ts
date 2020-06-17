import {
  Component,
  HostListener,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { World, Product, Pallier } from './models/world';
import { RestserviceService } from './services/restservice/restservice.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductComponent } from './product/product.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  world: World = new World();
  server: string;
  username: string;
  qtmulti: number = 1;
  @ViewChildren(ProductComponent) productComponents: QueryList<
    ProductComponent
  >;

  showManagers = false;
  badgeManagers = 0;

  showUnlocks = false;

  showUpgrades = false;
  badgeUpgrades = 0;

  showAngelUpgrades = false;
  badgeAngelUpgrades = 0;

  showInvestors = false;

  @HostListener('window:keydown.esc') onKeyDown() {
    this.showManagers = false;
    this.showUnlocks = false;
    this.showUpgrades = false;
    this.showAngelUpgrades = false;
    this.showInvestors = false;
  }

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
      if (manager.seuil < this.world.money && !manager.unlocked)
        this.badgeManagers += 1;
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

  onBuy(obj: { amount: number; p: Product }): void {
    if (this.world.money >= obj.amount) {
      this.world.money -= obj.amount;
      this.service.putProduct(obj.p);

      let products = this.world.products.product;

      // On récupère la quantité minimale de produits
      let qttMini = products[0].quantite;
      for (let i = 1; i < products.length - 1; i++) {
        if (products[i].quantite < qttMini) {
          qttMini = products[i].quantite;
        }
      }
      for (let p of this.world.allunlocks.pallier) {
        if (p.seuil < qttMini && !p.unlocked) {
          this.productComponents.forEach((product) => product.calcUpgrade(p));
          this.snackBar.open('You just unlocked ' + p.name, '', {
            duration: 4000,
          });
        }
      }
    }
  }

  hireManager(manager: Pallier): void {
    if (this.world.money < manager.seuil) {
      return;
    }

    this.service
      .putManager(manager)
      .then(() => {
        this.world.money -= manager.seuil;
        manager.unlocked = true;
        this.world.products.product[manager.idcible - 1].managerUnlocked = true;
        this.snackBar.open(manager.name + ' just joinned your universe', '', {
          duration: 4000,
        });
      })
      .catch(() => {
        this.snackBar.open('An error as occured', '', {
          duration: 4000,
        });
      });
  }

  onUsernameChanged(): void {
    this.service.user = this.username;
  }

  togleManager(): void {
    this.showManagers;
    this.showUnlocks;
  }

  nextUnlocks(product?: Product): Pallier {
    let pallier: Pallier[];
    if (product == null) {
      pallier = this.world.allunlocks.pallier;
    } else {
      pallier = product.palliers.pallier;
    }
    for (let i = 0; i < pallier.length - 1; i++) {
      if (!pallier[i].unlocked) {
        return pallier[i];
      }
    }
    return null;
  }

  buyUpgrade(upgrade: Pallier): void {
    if (this.world.money < upgrade.seuil) {
      return;
    }

    this.service
      .putUpgrade(upgrade)
      .then(() => {
        upgrade.unlocked = true;
        let products: Product[];
        if (upgrade.idcible > 0) {
          this.productComponents.forEach((p) => {
            if (p.product.id == upgrade.idcible) products = [p.product];
          });
        } else if (upgrade.idcible == 0){
          products = [];
          this.productComponents.forEach((p) => {
            products.push(p.product);
          });
        }
        switch (upgrade.typeratio) {
          case 'gain':
            for (let p of products) {
              p.revenu = p.revenu * upgrade.ratio;
            }
            break;
          case 'vitesse':
            for (let p of products) {
              p.vitesse = p.vitesse / upgrade.ratio;
              p.timeleft = p.timeleft / p.timeleft;
            }
            break;
          case 'ange':
            break;
        }
        this.world.money -= upgrade.seuil;
      })
      .catch(() => {
        this.snackBar.open('An error as occured', '', {
          duration: 4000,
        });
      });
  }
}
