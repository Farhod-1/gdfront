import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

const GAME_W = 960;
const GAME_H = 600;
const TOOLBAR_H = 48;
const DISPLAY_W = 816;
const DISPLAY_H = 510;
const FIXED_SCALE = DISPLAY_W / GAME_W;

@Component({
  selector: 'app-game',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {},
  template: `
    <div class="toolbar">
      <button class="btn" (click)="goBack()" aria-label="Back to games">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Back
      </button>
      <span class="game-title">{{ title() }}</span>
      <button class="btn" (click)="toggleFullscreen()" aria-label="Toggle fullscreen">
        @if (!isFullscreen()) {
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        } @else {
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        }
      </button>
    </div>

    <div class="game-area">
      @if (gameUrl()) {
        <iframe
          [src]="gameUrl()!"
          [style.zoom]="scale"
          [title]="title()"
          width="1000"
          height="650"
          scrolling="no"
          frameborder="0"
          allowfullscreen
          style="border: none; display: block; flex-shrink: 0"
        ></iframe>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        max-width: 100vw;
        max-height: 100vh;
        overflow: hidden;
        background: #1a1a1a;
        font-family: 'Segoe UI', system-ui, sans-serif;
      }

      .toolbar {
        height: ${TOOLBAR_H}px;
        min-height: ${TOOLBAR_H}px;
        display: flex;
        align-items: center;
        padding: 0 1rem;
        gap: 0.75rem;
        background: rgba(0, 0, 0, 0.5);
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        box-sizing: border-box;
      }

      .game-title {
        flex: 1;
        text-align: center;
        color: rgba(255, 255, 255, 0.65);
        font-size: 0.875rem;
        font-weight: 500;
        letter-spacing: 0.05em;
      }

      .btn {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.3rem 0.7rem;
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 7px;
        color: rgba(255, 255, 255, 0.75);
        font-size: 0.82rem;
        cursor: pointer;
        transition: background 0.15s, border-color 0.15s;
        white-space: nowrap;
        flex-shrink: 0;
      }

      .btn:hover {
        background: rgba(255, 255, 255, 0.12);
        border-color: rgba(255, 255, 255, 0.25);
        color: #fff;
      }

      .btn:focus-visible {
        outline: 2px solid rgba(100, 160, 255, 0.8);
        outline-offset: 2px;
      }

      .btn svg {
        width: 15px;
        height: 15px;
      }

      .game-area {
        flex: 1;
        min-width: 0;
        min-height: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }
    `,
  ],
})
export class GameComponent {
  private sanitizer = inject(DomSanitizer);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  protected readonly scale = FIXED_SCALE;
  protected readonly isFullscreen = signal(!!document.fullscreenElement);

  protected readonly title = toSignal(
    this.route.data.pipe(map((d) => d['name'] as string)),
    { initialValue: 'Game' },
  );

  protected readonly gameUrl = toSignal(
    this.route.data.pipe(
      map((d) => this.sanitizer.bypassSecurityTrustResourceUrl(d['assetUrl'] as string)),
    ),
  );

  protected goBack(): void {
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

}
