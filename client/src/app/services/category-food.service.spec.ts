import { TestBed, inject } from '@angular/core/testing';

import { CategoryFoodService } from './category-food.service';

describe('CategoryFoodService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CategoryFoodService]
    });
  });

  it('should be created', inject([CategoryFoodService], (service: CategoryFoodService) => {
    expect(service).toBeTruthy();
  }));
});
