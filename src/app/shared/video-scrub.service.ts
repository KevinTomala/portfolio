import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Cada página reproduce el video compartido completo (0 → 1) a lo largo de
 * su propio scroll — no un cuarto fijo por ruta. Al navegar, el video vuelve
 * a empezar desde 0 para que cada página cuente la historia completa.
 */
@Injectable({ providedIn: 'root' })
export class VideoScrubService {
  readonly reducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  private videoEl: HTMLVideoElement | null = null;
  private duration = 0;

  private readonly scrollProgressSubject = new BehaviorSubject<number>(0);
  readonly scrollProgress$ = this.scrollProgressSubject.asObservable();

  setVideoElement(el: HTMLVideoElement) {
    this.videoEl = el;
    if (el.readyState >= 1) {
      this.duration = el.duration;
      this.seekToStart();
    } else {
      el.addEventListener(
        'loadedmetadata',
        () => {
          this.duration = el.duration;
          this.seekToStart();
        },
        { once: true }
      );
    }
  }

  /** Llamar en cada NavigationEnd: reinicia el video al comienzo de la página nueva. */
  setRoute(_url: string) {
    this.scrollProgressSubject.next(0);
    this.seekToStart();
  }

  /** Llamar en cada scroll con el ratio (0-1) de la página completa. */
  setScrollRatio(ratio: number) {
    const clamped = Math.min(1, Math.max(0, ratio));
    this.scrollProgressSubject.next(clamped * 100);

    if (!this.videoEl || this.reducedMotion || !this.duration) return;
    this.videoEl.currentTime = clamped * this.duration;
  }

  private seekToStart() {
    if (!this.videoEl) return;
    this.videoEl.currentTime = 0;
  }
}
