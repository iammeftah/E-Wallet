import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/backoffice-components/sidebar/sidebar.component';
import {Router, ActivatedRoute, RouterOutlet} from '@angular/router';
import {HeaderComponent} from '../../components/layout/header/header.component';

@Component({
  selector: 'app-backoffice-page',
  templateUrl: './backoffice-page.component.html',
  styleUrls: ['./backoffice-page.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    RouterOutlet,
    HeaderComponent,
  ]
})
export class BackofficePageComponent {
  currentView: string = 'agents';

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.firstChild?.url.subscribe(segments => {
      if (segments.length > 0) {
        this.currentView = segments[0].path;
      }
    });
  }

  setCurrentView(view: string) {
    this.currentView = view;
    this.router.navigate([view], { relativeTo: this.route });
  }
}

