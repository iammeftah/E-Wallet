import { Component } from '@angular/core';
import {HeaderComponent} from '../../components/layout/header/header.component';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  imports: [
    HeaderComponent,
  ],
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

}
