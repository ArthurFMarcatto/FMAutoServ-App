import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VeiculoDetail } from './veiculo-detail';

describe('VeiculoDetail', () => {
  let component: VeiculoDetail;
  let fixture: ComponentFixture<VeiculoDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VeiculoDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(VeiculoDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
