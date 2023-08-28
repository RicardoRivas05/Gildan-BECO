import { ComponentFixture, TestBed } from '@angular/core/testing';

import { horasPuntaComponent } from './horasPunta.component';

describe('horasPuntaComponent', () => {
  let component: horasPuntaComponent;
  let fixture: ComponentFixture<horasPuntaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ horasPuntaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(horasPuntaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
