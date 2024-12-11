import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpAgentComponent } from './sign-up-agent.component';

describe('SignUpAgentComponent', () => {
  let component: SignUpAgentComponent;
  let fixture: ComponentFixture<SignUpAgentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignUpAgentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignUpAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
