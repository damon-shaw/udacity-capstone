import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoritePlatesComponent } from './favorite-plates.component';

describe('FavoritePlatesComponent', () => {
  let component: FavoritePlatesComponent;
  let fixture: ComponentFixture<FavoritePlatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavoritePlatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoritePlatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
