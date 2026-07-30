import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface Segment {
  start: number;
  end: number;
}

/** Orden de las rutas dentro del video compartido (ver app.routes.ts). */
const ROUTE_SEGMENTS: Record<string, Segment> = {
  '': { start: 0, end: 0.25 },
  portfolio: { start: 0.25, end: 0.5 },
  contact: { start: 0.5, end: 0.75 },
  about: { start: 0.75, end: 1 },
};

@Injectable({ providedIn: 'root' })
export class VideoScrubService {
  readonly reducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  private videoEl: HTMLVideoElement | null = null;
  private duration = 0;
  private segment: Segment = ROUTE_SEGMENTS[''];

  private readonly scrollProgressSubject = new BehaviorSubject<number>(0);
  readonly scrollProgress$ = this.scrollProgressSubject.asObservable();

  setVideoElement(el: HTMLVideoElement) {
    this.videoEl = el;
    if (el.readyState >= 1) {
      this.duration = el.duration;
      this.seekToSegmentStart();
    } else {
      el.addEventListener(
        'loadedmetadata',
        () => {
          this.duration = el.duration;
          this.seekToSegmentStart();
        },
        { once: true }
      );
    }
  }

  /** Llamar en cada NavigationEnd con la url activa (ej. '/portfolio'). */
  setRoute(url: string) {
    const path = url.replace(/^\//, '').split('?')[0].split('#')[0];
    this.segment = ROUTE_SEGMENTS[path] ?? ROUTE_SEGMENTS[''];
    this.scrollProgressSubject.next(0);
    this.seekToSegmentStart();
  }

  /**
   * Ratio (0-1) del scroll dentro de la "zona de video" (una pantalla de alto),
   * no de la página completa — si no, en páginas largas el segmento (solo 25%
   * del clip) queda diluido en miles de px y da la sensación de que no avanza.
   */
  setScrollRatio(ratio: number) {
    const clamped = Math.min(1, Math.max(0, ratio));

    if (!this.videoEl || this.reducedMotion || !this.duration) return;
    const { start, end } = this.segment;
    this.videoEl.currentTime = (start + clamped * (end - start)) * this.duration;
  }

  /** Ratio (0-1) del scroll de la página completa, para la barra de progreso. */
  setPageProgress(ratio: number) {
    const clamped = Math.min(1, Math.max(0, ratio));
    this.scrollProgressSubject.next(clamped * 100);
  }

  private seekToSegmentStart() {
    if (!this.videoEl || !this.duration) return;
    this.videoEl.currentTime = this.segment.start * this.duration;
  }
}
