import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EspecialChargesComponent } from './especial-charges.component';

describe('EspecialChargesComponent', () => {
  let component: EspecialChargesComponent;
  let fixture: ComponentFixture<EspecialChargesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EspecialChargesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EspecialChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
