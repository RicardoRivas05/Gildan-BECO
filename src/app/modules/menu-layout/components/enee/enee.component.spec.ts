import { ComponentFixture, TestBed } from '@angular/core/testing';

import { eneeComponent } from './enee.component';

describe('eneeComponent', () => {
  let component: eneeComponent;
  let fixture: ComponentFixture<eneeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ eneeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(eneeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
