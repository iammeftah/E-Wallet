import { Component, OnInit } from '@angular/core';
import {HeaderComponent} from '../../components/layout/header/header.component';
import {FormsModule} from '@angular/forms';

interface ContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

@Component({
  selector: 'app-contact-support-page',
  templateUrl: './contact-support-page.component.html',
  imports: [
    HeaderComponent,
    FormsModule
  ],
  styleUrls: ['./contact-support-page.component.css']
})
export class ContactSupportPageComponent implements OnInit {
  contactData: ContactData = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  constructor() { }

  ngOnInit(): void {
    // Initialize any necessary data or perform any setup tasks
  }

  onSubmit(): void {
    // Handle form submission
    console.log('Form submitted:', this.contactData);
    // You can add your logic here to send the form data to a server or perform any other actions
    // For example:
    // this.contactService.sendMessage(this.contactData).subscribe(
    //   response => {
    //     console.log('Message sent successfully', response);
    //     // Reset the form or show a success message
    //   },
    //   error => {
    //     console.error('Error sending message', error);
    //     // Show an error message to the user
    //   }
    // );

    // Reset the form after submission
    this.contactData = {
      name: '',
      email: '',
      subject: '',
      message: ''
    };
  }
}

