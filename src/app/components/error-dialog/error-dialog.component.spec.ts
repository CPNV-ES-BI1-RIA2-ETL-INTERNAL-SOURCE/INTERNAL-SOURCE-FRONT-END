import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ErrorDialogComponent } from './error-dialog.component';

describe('ErrorDialogComponent', () => {
  let component: ErrorDialogComponent;
  let fixture: ComponentFixture<ErrorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorDialogComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Dialog Behavior', () => {
    it('should display the error message passed as input', () => {
      // Given
      const testErrorMessage = 'Test error message';
      component.message = testErrorMessage;

      // When
      fixture.detectChanges();

      // Then
      const messageElement = fixture.debugElement.query(By.css('#error'));
      expect(messageElement.nativeElement.textContent).toContain(testErrorMessage);
    });
  });
});
