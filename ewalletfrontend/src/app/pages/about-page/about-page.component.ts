import { Component, OnInit } from '@angular/core';
import {HeaderComponent} from '../../components/layout/header/header.component';

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  imports: [
    HeaderComponent
  ],
  styleUrls: ['./about-page.component.css']
})
export class AboutPageComponent implements OnInit {
  teamMembers = [
    { name: 'John Doe', position: 'CEO & Founder', image: 'assets/images/team-member-1.jpg' },
    { name: 'Jane Smith', position: 'CTO', image: 'assets/images/team-member-2.jpg' },
    { name: 'Mike Johnson', position: 'Head of Security', image: 'assets/images/team-member-3.jpg' }
  ];

  constructor() { }

  ngOnInit(): void {
    // Initialize any necessary data or perform any setup tasks
  }
}
