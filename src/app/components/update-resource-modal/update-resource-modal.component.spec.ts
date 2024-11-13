import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateResourceModalComponent } from './update-resource-modal.component';

describe('UpdateResourceModalComponent', () => {
  let component: UpdateResourceModalComponent;
  let fixture: ComponentFixture<UpdateResourceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateResourceModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateResourceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
