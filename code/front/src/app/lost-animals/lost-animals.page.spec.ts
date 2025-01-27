import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LostAnimalsPage } from './lost-animals.page';

describe('LostAnimalsPage', () => {
  let component: LostAnimalsPage;
  let fixture: ComponentFixture<LostAnimalsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LostAnimalsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
