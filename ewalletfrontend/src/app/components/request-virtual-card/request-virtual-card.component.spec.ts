import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestVirtualCardComponent } from './request-virtual-card.component';

describe('RequestVirtualCardComponent', () => {
  let component: RequestVirtualCardComponent;
  let fixture: ComponentFixture<RequestVirtualCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequestVirtualCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestVirtualCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
