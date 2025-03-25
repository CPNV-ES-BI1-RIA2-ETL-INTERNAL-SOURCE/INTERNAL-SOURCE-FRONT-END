import {Component, Input, SecurityContext} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-chart',
  imports: [],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css'
})
export class ChartComponent {
  @Input() set url(value: string) {
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(value);
  }

  safeUrl!: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {}
}
