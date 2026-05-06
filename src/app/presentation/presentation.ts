import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-presentation',
  standalone: true,
  imports: [NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="presentation">
      <header class="header">
        <button class="btn" type="button" (click)="goToGames()" aria-label="Go to games">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M10 19l-7-7 7-7"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M3 12h18"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
          Games
        </button>

        <span class="title">Presentation</span>

        <button
          class="btn"
          type="button"
          (click)="toggleFullscreen()"
          aria-label="Toggle fullscreen"
        >
          @if (!isFullscreen()) {
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          } @else {
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          }
          Fullscreen
        </button>
      </header>

      <main class="content">
        <div class="viewport" *ngIf="slides.length">
          <button
            class="nav-btn left"
            type="button"
            (click)="prev()"
            aria-label="Previous slide"
          >
            ‹
          </button>

          <img
            class="slide"
            [class.fading]="isFading()"
            [src]="slides[currentIndex()]"
            [alt]="'Slide ' + (currentIndex() + 1)"
          />

          <button
            class="nav-btn right"
            type="button"
            (click)="next()"
            aria-label="Next slide"
          >
            ›
          </button>
        </div>

        <p class="hint" *ngIf="!slides.length">
          No slides configured yet. Make sure your images are available under
          <code>/assets/presentation/</code> and list them in this component.
        </p>

        <div class="dots" *ngIf="slides.length">
          @for (_ of slides; track $index) {
            <button
              class="dot"
              type="button"
              [class.active]="$index === currentIndex()"
              (click)="goTo($index)"
              [attr.aria-label]="'Go to slide ' + ($index + 1)"
            ></button>
          }
        </div>

        <div class="progress-wrap" *ngIf="slides.length">
          <div class="progress-bar" aria-hidden="true">
            <div
              class="progress-fill"
              [style.width.%]="progressPercent()"
            ></div>
          </div>
        </div>

        @if (isLastSlide()) {
          <button class="end-btn" type="button" (click)="goToGames()">
            Go to games
          </button>
        }
      </main>
    </div>
  `,
  styles: [
    `
      :host {
        display: flex;
        width: 100%;
        height: 100%;
        background: #0f0f13;
        color: #fff;
        font-family: 'Segoe UI', system-ui, sans-serif;
      }

      .presentation {
        display: flex;
        flex-direction: column;
        width: 100%;
      }

      .header {
        height: 56px;
        min-height: 56px;
        padding: 0 2rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        background: rgba(15, 15, 19, 0.92);
        backdrop-filter: blur(12px);
      }

      .title {
        flex: 1;
        text-align: center;
        font-size: 1.1rem;
        font-weight: 600;
        letter-spacing: 0.04em;
      }

      .btn {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        padding: 0.35rem 0.75rem;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        background: rgba(255, 255, 255, 0.06);
        color: rgba(255, 255, 255, 0.85);
        cursor: pointer;
        transition: background 0.15s, border-color 0.15s, color 0.15s;
        white-space: nowrap;
        font-size: 0.85rem;
      }

      .btn:hover {
        background: rgba(255, 255, 255, 0.12);
        border-color: rgba(255, 255, 255, 0.25);
        color: #fff;
      }

      .btn:focus-visible {
        outline: 2px solid rgba(100, 160, 255, 0.85);
        outline-offset: 2px;
      }

      .btn svg {
        width: 16px;
        height: 16px;
      }

      .content {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 1.5rem;
        gap: 1rem;
      }

      .viewport {
        position: relative;
        max-width: min(960px, 100%);
        max-height: min(540px, calc(100vh - 150px));
        aspect-ratio: 16 / 9;
        border-radius: 16px;
        overflow: hidden;
        background: #15151f;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .slide {
        width: 100%;
        height: 100%;
        object-fit: contain;
        background: #15151f;
        user-select: none;
        transition: opacity 180ms ease;
      }

      .slide.fading {
        opacity: 0.15;
      }

      .nav-btn {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 40px;
        height: 40px;
        border-radius: 999px;
        border: none;
        background: rgba(15, 15, 19, 0.7);
        color: rgba(255, 255, 255, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 1.6rem;
        line-height: 1;
        backdrop-filter: blur(10px);
        transition: background 0.15s, transform 0.15s;
      }

      .nav-btn.left {
        left: 16px;
      }

      .nav-btn.right {
        right: 16px;
      }

      .nav-btn:hover {
        background: rgba(40, 40, 55, 0.9);
        transform: translateY(-50%) scale(1.05);
      }

      .dots {
        display: flex;
        gap: 0.4rem;
        justify-content: center;
      }

      .dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        border: none;
        background: rgba(255, 255, 255, 0.25);
        cursor: pointer;
        padding: 0;
        transition: background 0.15s, transform 0.15s, width 0.15s;
      }

      .dot.active {
        width: 20px;
        border-radius: 999px;
        background: #78a0ff;
        transform: translateY(-1px);
      }

      .hint {
        color: rgba(255, 255, 255, 0.6);
        font-size: 0.9rem;
      }

      .hint code {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
          'Liberation Mono', 'Courier New', monospace;
        background: rgba(255, 255, 255, 0.04);
        padding: 0.15rem 0.35rem;
        border-radius: 4px;
      }

      .progress-wrap {
        width: min(960px, 100%);
        padding: 0 0.2rem;
      }

      .progress-bar {
        height: 6px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.12);
        overflow: hidden;
      }

      .progress-fill {
        height: 100%;
        border-radius: 999px;
        background: #78a0ff;
        transition: width 180ms ease;
      }

      .end-btn {
        margin-top: 0.25rem;
        padding: 0.6rem 1rem;
        border-radius: 12px;
        border: 1px solid rgba(120, 160, 255, 0.5);
        background: rgba(120, 160, 255, 0.15);
        color: #eaf0ff;
        cursor: pointer;
        font-weight: 600;
        letter-spacing: 0.02em;
        transition: transform 0.15s, background 0.15s, border-color 0.15s;
      }

      .end-btn:hover {
        transform: translateY(-1px);
        background: rgba(120, 160, 255, 0.22);
        border-color: rgba(120, 160, 255, 0.75);
      }
    `,
  ],
})
export class PresentationComponent {
  private router = inject(Router);

  // Slide images are in: gdfront/public/assets/presentation/{1..13}.png
  protected readonly slides: string[] = Array.from(
    { length: 13 },
    (_, i) => `/assets/presentation/${i + 1}.png`,
  );

  protected readonly currentIndex = signal(0);
  protected readonly isFading = signal(false);
  protected readonly isFullscreen = signal(!!document.fullscreenElement);

  private readonly FADE_MS = 140;

  protected isLastSlide(): boolean {
    return this.slides.length > 0 && this.currentIndex() === this.slides.length - 1;
  }

  protected progressPercent(): number {
    if (this.slides.length <= 1) return 100;
    return (this.currentIndex() / (this.slides.length - 1)) * 100;
  }

  protected goToGames(): void {
    this.router.navigate(['/']);
  }

  protected toggleFullscreen(): void {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      this.isFullscreen.set(true);
    } else {
      document.exitFullscreen();
      this.isFullscreen.set(false);
    }
  }

  private setIndex(nextIndex: number): void {
    if (!this.slides.length) return;
    if (nextIndex < 0 || nextIndex >= this.slides.length) return;
    // Simple fade-to-next to feel closer to Canva-style transitions.
    this.isFading.set(true);
    window.setTimeout(() => {
      this.currentIndex.set(nextIndex);
      this.isFading.set(false);
    }, this.FADE_MS);
  }

  protected next(): void {
    if (!this.slides.length) return;
    const nextIndex = (this.currentIndex() + 1) % this.slides.length;
    this.setIndex(nextIndex);
  }

  protected prev(): void {
    if (!this.slides.length) return;
    const nextIndex =
      (this.currentIndex() - 1 + this.slides.length) % this.slides.length;
    this.setIndex(nextIndex);
  }

  protected goTo(index: number): void {
    this.setIndex(index);
  }
}

