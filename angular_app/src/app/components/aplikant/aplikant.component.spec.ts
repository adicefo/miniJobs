import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AplikantComponent } from './aplikant.component';

describe('AplikantComponent', () => {
  let component: AplikantComponent;
  let fixture: ComponentFixture<AplikantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AplikantComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AplikantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
