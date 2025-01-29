import { TestBed } from '@angular/core/testing';

import { UserTryService } from './user-try.service';

describe('UserTryService', () => {
  let service: UserTryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserTryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
