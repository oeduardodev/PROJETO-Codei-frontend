import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
} from "@angular/core";

@Directive({
  selector: "img[appImageFallback]",
  standalone: true,
})
export class ImageFallbackDirective implements OnChanges {
  @Input() appImageFallback = "/assets/profile-default-img.png";

  private fallbackApplied = false;

  constructor(private elementRef: ElementRef<HTMLImageElement>) {}

  ngOnChanges(): void {
    this.fallbackApplied = false;
  }

  @HostListener("error")
  onError(): void {
    if (this.fallbackApplied) {
      return;
    }

    this.fallbackApplied = true;
    this.elementRef.nativeElement.src = this.appImageFallback;
  }
}
