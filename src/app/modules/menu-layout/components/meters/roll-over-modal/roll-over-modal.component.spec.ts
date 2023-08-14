import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RollOverModalComponent } from './roll-over-modal.component';

describe('RollOverModalComponent', () => {
  let component: RollOverModalComponent;
  let fixture: ComponentFixture<RollOverModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RollOverModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RollOverModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
