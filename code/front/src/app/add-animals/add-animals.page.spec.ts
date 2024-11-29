import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddAnimalsPage } from './add-animals.page';

describe('AddAnimalsPage', () => {
  let component: AddAnimalsPage;
  let fixture: ComponentFixture<AddAnimalsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAnimalsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
