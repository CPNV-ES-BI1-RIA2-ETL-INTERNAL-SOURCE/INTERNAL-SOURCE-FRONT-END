import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-dialog.component.html',
  styleUrl: './error-dialog.component.css'
})

/**
 * @summary The error dialog component to show error in a dialog box.
 */
export class ErrorDialogComponent implements AfterViewInit {
  @Input() message: string = '';
  @Output() close = new EventEmitter<void>();
  @ViewChild('errorDialog') dialogRef!: ElementRef<HTMLDialogElement>;

  /**
   * @summary ngOnInit  is called once, after the component has been initialized.
   * @returns {Promise<void>}
   */
  ngAfterViewInit() {
    setTimeout(() => {
      if (this.dialogRef?.nativeElement) {
        if (!this.dialogRef.nativeElement.open) {
          this.dialogRef.nativeElement.showModal();
        }
      }
    });
  }

  /**
   * @summary allow to close the dialog when button clicked.
   * @return {void} Does not return anything.
   */
  onClose() {
    if (this.dialogRef?.nativeElement) {
      this.dialogRef.nativeElement.close();
    }
    this.close.emit();
  }
}
