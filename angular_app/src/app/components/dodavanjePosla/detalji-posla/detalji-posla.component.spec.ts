import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetaljiPoslaComponent } from './detalji-posla.component';

describe('DetaljiPoslaComponent', () => {
  let component: DetaljiPoslaComponent;
  let fixture: ComponentFixture<DetaljiPoslaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetaljiPoslaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetaljiPoslaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
