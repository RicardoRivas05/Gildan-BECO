import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmiteneeModalComponent } from './submit-enee-modal.component';

describe('SubmiteneeModalComponent', () => {
  let component: SubmiteneeModalComponent;
  let fixture: ComponentFixture<SubmiteneeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmiteneeModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmiteneeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
