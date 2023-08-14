import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuedInvoicesComponent } from './issued-invoices.component';

describe('IssuedInvoicesComponent', () => {
  let component: IssuedInvoicesComponent;
  let fixture: ComponentFixture<IssuedInvoicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IssuedInvoicesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IssuedInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
