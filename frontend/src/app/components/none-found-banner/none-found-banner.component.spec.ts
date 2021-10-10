import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoneFoundBannerComponent } from './none-found-banner.component';

describe('NoneFoundBannerComponent', () => {
  let component: NoneFoundBannerComponent;
  let fixture: ComponentFixture<NoneFoundBannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoneFoundBannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoneFoundBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
