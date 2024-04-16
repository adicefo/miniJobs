import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpisPoslaComponent } from './opis-posla.component';

describe('OpisPoslaComponent', () => {
  let component: OpisPoslaComponent;
  let fixture: ComponentFixture<OpisPoslaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpisPoslaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpisPoslaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
