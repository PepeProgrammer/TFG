import { TestBed } from '@angular/core/testing';

import { Geoloc } from './geolocation.service';

describe('DataService', () => {
  let service: Geoloc;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Geoloc);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
