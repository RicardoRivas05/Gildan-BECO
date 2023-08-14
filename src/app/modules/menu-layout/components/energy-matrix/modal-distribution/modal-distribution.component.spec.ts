import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDistributionComponent } from './modal-distribution.component';

describe('ModalDistributionComponent', () => {
  let component: ModalDistributionComponent;
  let fixture: ComponentFixture<ModalDistributionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalDistributionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
