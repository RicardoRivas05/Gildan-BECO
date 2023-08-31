import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitdollarModalComponent } from './submit-dollar-modal.component';

describe('SubmitdollarModalComponent', () => {
  let component: SubmitdollarModalComponent;
  let fixture: ComponentFixture<SubmitdollarModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmitdollarModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitdollarModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
