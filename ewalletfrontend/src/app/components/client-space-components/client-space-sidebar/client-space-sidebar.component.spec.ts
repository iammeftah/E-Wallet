import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientSpaceSidebarComponent } from './client-space-sidebar.component';

describe('ClientSpaceSidebarComponent', () => {
  let component: ClientSpaceSidebarComponent;
  let fixture: ComponentFixture<ClientSpaceSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClientSpaceSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientSpaceSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
