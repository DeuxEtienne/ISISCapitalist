import { Component } from '@angular/core';
import { World, Product, Pallier } from './models/world';
import { RestserviceService } from './services/restservice/restservice.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  world: World = new World();
  server: string;

  constructor(private service: RestserviceService) {
    this.server = service.getServer()
    service.getWorld().then(
      world => {
        this.world = world;
      }
    )
  }
}
