import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-dialog.component.html',
  styleUrl: './error-dialog.component.css'
})
export class ErrorDialogComponent implements AfterViewInit {
  @Input() message: string = '';
  @Output() close = new EventEmitter<void>();
  @ViewChild('errorDialog') dialogRef!: ElementRef<HTMLDialogElement>;
  
  ngAfterViewInit() {
    setTimeout(() => {
      if (this.dialogRef?.nativeElement) {
        if (!this.dialogRef.nativeElement.open) {
          this.dialogRef.nativeElement.showModal();
        }
      }
    });
  }

  onClose() {
    if (this.dialogRef?.nativeElement) {
      this.dialogRef.nativeElement.close();
    }
    this.close.emit();
  }
} 