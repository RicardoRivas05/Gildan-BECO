import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitProviderModalComponent } from './submit-provider-modal.component';

describe('SubmitProviderModalComponent', () => {
  let component: SubmitProviderModalComponent;
  let fixture: ComponentFixture<SubmitProviderModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmitProviderModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitProviderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
