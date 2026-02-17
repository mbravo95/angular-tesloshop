import { Component } from '@angular/core';
import { RouterOutlet } from "../../../../../node_modules/@angular/router/types/_router_module-chunk";
import { FrontNavbar } from "../../components/front-navbar/front-navbar";

@Component({
  selector: 'app-store-front-layout',
  imports: [RouterOutlet, FrontNavbar],
  templateUrl: './store-front-layout.html',
})
export class StoreFrontLayout {

}
