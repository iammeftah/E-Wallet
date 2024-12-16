import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientSpacePageComponent } from './client-space-page.component';

describe('ClientSpacePageComponent', () => {
  let component: ClientSpacePageComponent;
  let fixture: ComponentFixture<ClientSpacePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClientSpacePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientSpacePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
