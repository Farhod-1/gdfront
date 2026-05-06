import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { GamesService, Game } from '../games.service';

@Component({
  selector: 'app-games-list',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header>
      <span class="logo">🎮 GD Games</span>
      <a [routerLink]="'/presentation'" class="pres-btn" aria-label="Go to presentation">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" stroke-width="2"/>
          <path d="M8 21h8M12 17v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        Presentation
      </a>
    </header>

    <main>
      @if (games() === undefined) {
        <div class="skeleton-grid">
          @for (_ of skeletons; track $index) {
            <div class="skeleton-card"></div>
          }
        </div>
      } @else if (games()!.length === 0) {
        <p class="empty">No games found.</p>
      } @else {
        <div class="grid">
          @for (game of games()!; track game.id) {
            <a [routerLink]="game.path" class="card" [attr.aria-label]="'Play ' + game.name">
              <div class="cover">
                <img
                  [src]="game.thumbnailUrl"
                  [alt]="game.name"
                  (error)="onImgError($event, game)"
                  loading="lazy"
                />
                <div class="play-overlay" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="11" fill="rgba(0,0,0,0.55)"/>
                    <polygon points="10,8 17,12 10,16" fill="white"/>
                  </svg>
                </div>
              </div>
              <div class="info">
                <span class="name">{{ game.name }}</span>
                <span class="tag">WebGL</span>
              </div>
            </a>
          }
        </div>
      }
    </main>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        overflow-y: auto;
        background: #0f0f13;
        font-family: 'Segoe UI', system-ui, sans-serif;
        color: #fff;
        box-sizing: border-box;
      }

      header {
        position: sticky;
        top: 0;
        z-index: 10;
        display: flex;
        align-items: center;
        padding: 0 2rem;
        height: 56px;
        background: rgba(15, 15, 19, 0.92);
        backdrop-filter: blur(12px);
        border-bottom: 1px solid rgba(255, 255, 255, 0.07);
        flex-shrink: 0;
      }

      .logo {
        flex: 1;
        font-size: 1.1rem;
        font-weight: 700;
        letter-spacing: 0.03em;
        color: #fff;
      }

      .pres-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        padding: 0.35rem 0.8rem;
        border-radius: 8px;
        border: 1px solid rgba(120, 160, 255, 0.35);
        background: rgba(120, 160, 255, 0.1);
        color: rgba(180, 210, 255, 0.9);
        text-decoration: none;
        font-size: 0.85rem;
        font-weight: 500;
        white-space: nowrap;
        transition: background 0.15s, border-color 0.15s, color 0.15s;
      }

      .pres-btn:hover {
        background: rgba(120, 160, 255, 0.2);
        border-color: rgba(120, 160, 255, 0.65);
        color: #eaf0ff;
      }

      .pres-btn:focus-visible {
        outline: 2px solid rgba(100, 160, 255, 0.85);
        outline-offset: 2px;
      }

      .pres-btn svg {
        width: 16px;
        height: 16px;
      }

      main {
        flex: 1;
        padding: 2rem;
        box-sizing: border-box;
      }

      .grid {
        display: grid;
        /* "one line max 4 games" */
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 1.25rem;
      }

      @media (max-width: 920px) {
        .grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (max-width: 480px) {
        .grid {
          grid-template-columns: repeat(1, minmax(0, 1fr));
        }
      }

      .card {
        display: flex;
        flex-direction: column;
        border-radius: 14px;
        overflow: hidden;
        text-decoration: none;
        background: rgba(26, 26, 34, 0.88);
        border: 1px solid rgba(255, 255, 255, 0.09);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
        transition:
          transform 0.18s,
          border-color 0.18s,
          box-shadow 0.18s,
          background-color 0.18s;
        cursor: pointer;
      }

      .card:hover {
        transform: translateY(-4px) scale(1.02);
        border-color: rgba(120, 160, 255, 0.4);
        box-shadow: 0 18px 45px rgba(0, 0, 0, 0.55);
      }

      .card:focus-visible {
        outline: 2px solid rgba(100, 160, 255, 0.8);
        outline-offset: 2px;
      }

      .cover {
        position: relative;
        aspect-ratio: 16 / 9;
        background: #252530;
        overflow: hidden;
        border-radius: 14px 14px 0 0;
      }

      .cover::after {
        content: '';
        position: absolute;
        inset: 0;
        pointer-events: none;
        background: linear-gradient(
          180deg,
          rgba(0, 0, 0, 0) 35%,
          rgba(0, 0, 0, 0.25) 55%,
          rgba(0, 0, 0, 0.65) 100%
        );
      }

      .cover img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .play-overlay {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        backdrop-filter: blur(8px);
        background: radial-gradient(
          circle at 50% 60%,
          rgba(120, 160, 255, 0.18) 0%,
          rgba(0, 0, 0, 0.35) 60%,
          rgba(0, 0, 0, 0.55) 100%
        );
        transition: opacity 0.18s, transform 0.18s;
        transform: scale(0.98);
      }

      .play-overlay svg {
        width: 52px;
        height: 52px;
        transition: transform 0.18s;
      }

      .info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.65rem 0.85rem;
        gap: 0.5rem;
        background: rgba(0, 0, 0, 0.28);
        backdrop-filter: blur(10px);
        border-top: 1px solid rgba(255, 255, 255, 0.06);
      }

      .name {
        font-size: 0.875rem;
        font-weight: 700;
        color: #e8e8f0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .tag {
        font-size: 0.7rem;
        font-weight: 600;
        color: rgba(120, 160, 255, 0.85);
        background: rgba(100, 140, 255, 0.18);
        border: 1px solid rgba(100, 140, 255, 0.35);
        border-radius: 4px;
        padding: 0.1rem 0.4rem;
        white-space: nowrap;
        flex-shrink: 0;
      }

      .card:hover .play-overlay {
        opacity: 1;
        transform: scale(1);
      }

      .card:hover .play-overlay svg {
        transform: scale(1.08);
      }

      /* skeleton */
      .skeleton-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 1.25rem;
      }

      @media (max-width: 920px) {
        .skeleton-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (max-width: 480px) {
        .skeleton-grid {
          grid-template-columns: repeat(1, minmax(0, 1fr));
        }
      }

      .skeleton-card {
        aspect-ratio: 16 / 9;
        border-radius: 14px;
        background: linear-gradient(90deg, #1a1a22 25%, #252530 50%, #1a1a22 75%);
        background-size: 200% 100%;
        animation: shimmer 1.4s infinite;
      }

      @keyframes shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }

      .empty {
        color: rgba(255, 255, 255, 0.35);
        text-align: center;
        margin-top: 4rem;
        font-size: 1rem;
      }
    `,
  ],
})
export class GamesListComponent {
  protected readonly games = toSignal(inject(GamesService).getGames());
  protected readonly skeletons = Array(10);

  protected onImgError(event: Event, game: Game): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    const cover = img.closest('.cover') as HTMLElement;
    if (cover) {
      cover.style.background = this.colorForId(game.id);
      const label = document.createElement('span');
      label.textContent = game.name[0].toUpperCase();
      label.style.cssText =
        'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:3rem;font-weight:700;color:rgba(255,255,255,0.4);font-family:inherit';
      cover.appendChild(label);
    }
  }

  private colorForId(id: string): string {
    const colors = [
      '#1a2540', '#251a40', '#1a3025', '#402520', '#252540',
      '#1a3535', '#352515', '#151535', '#353515', '#253015',
    ];
    let hash = 0;
    for (const c of id) hash = (hash * 31 + c.charCodeAt(0)) & 0xffffffff;
    return colors[Math.abs(hash) % colors.length];
  }
}
