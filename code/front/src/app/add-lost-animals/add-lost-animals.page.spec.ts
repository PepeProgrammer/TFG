import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddLostAnimalsPage } from './add-lost-animals.page';

describe('AddLostAnimalsPage', () => {
  let component: AddLostAnimalsPage;
  let fixture: ComponentFixture<AddLostAnimalsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLostAnimalsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
