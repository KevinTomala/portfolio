import { AfterViewInit, Component, ElementRef, OnDestroy } from '@angular/core';
import { initScrollReveal } from '../shared/scroll-reveal';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements AfterViewInit, OnDestroy {
  private revealObserver: IntersectionObserver | null = null;

  constructor(private elRef: ElementRef<HTMLElement>) {}

  ngAfterViewInit() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.revealObserver = initScrollReveal(this.elRef.nativeElement, reducedMotion);
  }

  ngOnDestroy() {
    this.revealObserver?.disconnect();
  }
}
