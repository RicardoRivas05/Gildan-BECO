import { ComponentFixture, TestBed } from '@angular/core/testing';

import { feriadosHnComponent } from './feriadosHn.component';

describe('feriadosHnComponent', () => {
  let component: feriadosHnComponent;
  let fixture: ComponentFixture<feriadosHnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ feriadosHnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(feriadosHnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
