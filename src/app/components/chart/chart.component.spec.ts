import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ChartComponent } from './chart.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

describe('ChartComponent', () => {
  let component: ChartComponent;
  let fixture: ComponentFixture<ChartComponent>;
  const mockUrl = 'src/app/mocks/charts/chart.html';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display chart when url is provided', () => {
    // Given
    component.url = mockUrl;

    // When
    fixture.detectChanges();

    // Then
    const iframe = fixture.debugElement.query(By.css('#chart'));
    expect(iframe).toBeTruthy();
  });
});
