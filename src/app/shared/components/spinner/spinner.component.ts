import { Component, Input, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import {ThemePalette} from '@angular/material/core';
import {ProgressSpinnerMode} from '@angular/material/progress-spinner';
import { TemplatePortal } from '@angular/cdk/portal';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit {
  @Input() displayProgressSpinner: boolean = false;
  @ViewChild('progressSpinnerRef', { read: TemplateRef, static: true })
  private progressSpinnerRef: TemplateRef<any>;
  private overlayRef: OverlayRef;

  constructor(private vcRef: ViewContainerRef, private overlay: Overlay) { }

  ngOnInit(): void {
    var config: OverlayConfig = {
      hasBackdrop: true,
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically()
    };
    this.overlayRef = this.overlay.create(config);
    //this.attachTemplatePortal(this.overlayRef, this.progressSpinnerRef, this.vcRef);
  }

  attachTemplatePortal(overlayRef: OverlayRef, templateRef: TemplateRef<any>, vcRef: ViewContainerRef) {
    let templatePortal = new TemplatePortal(templateRef, vcRef);
    overlayRef.attach(templatePortal);
  }

  ngDoCheck() {
    if (this.displayProgressSpinner && !this.overlayRef.hasAttached()) {
      this.attachTemplatePortal(this.overlayRef, this.progressSpinnerRef, this.vcRef);
    } else if (!this.displayProgressSpinner && this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
    }
  }
}