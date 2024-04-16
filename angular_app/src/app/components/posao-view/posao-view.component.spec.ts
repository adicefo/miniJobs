import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosaoViewComponent } from './posao-view.component';

describe('PosaoViewComponent', () => {
  let component: PosaoViewComponent;
  let fixture: ComponentFixture<PosaoViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosaoViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosaoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
