import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetersModalComponent } from './meters-modal.component';

describe('MetersModalComponent', () => {
  let component: MetersModalComponent;
  let fixture: ComponentFixture<MetersModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MetersModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MetersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
