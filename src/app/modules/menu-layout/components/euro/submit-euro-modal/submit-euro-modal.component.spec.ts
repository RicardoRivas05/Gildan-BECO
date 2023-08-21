import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmiteuroModalComponent } from './submit-euro-modal.component';

describe('SubmiteuroModalComponent', () => {
  let component: SubmiteuroModalComponent;
  let fixture: ComponentFixture<SubmiteuroModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmiteuroModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmiteuroModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
