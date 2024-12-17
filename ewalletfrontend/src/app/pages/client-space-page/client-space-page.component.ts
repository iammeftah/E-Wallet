import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClientSpaceSidebarComponent } from '../../components/client-space-components/client-space-sidebar/client-space-sidebar.component';
import { HeaderComponent } from '../../components/layout/header/header.component';



@Component({
  selector: 'app-client-space-page',
  standalone: true,
  imports: [CommonModule, RouterModule, ClientSpaceSidebarComponent, HeaderComponent],
  templateUrl: './client-space-page.component.html',
  styleUrls: ['./client-space-page.component.css']
})
export class ClientSpacePageComponent {}

