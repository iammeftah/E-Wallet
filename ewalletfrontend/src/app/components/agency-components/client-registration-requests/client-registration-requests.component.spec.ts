import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientRegistrationRequestsComponent } from './client-registration-requests.component';

describe('ClientRegistrationRequestsComponent', () => {
  let component: ClientRegistrationRequestsComponent;
  let fixture: ComponentFixture<ClientRegistrationRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClientRegistrationRequestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientRegistrationRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
