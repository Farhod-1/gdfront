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
        font-size: 1.1rem;
        font-weight: 700;
        letter-spacing: 0.03em;
        color: #fff;
      }

      main {
        flex: 1;
        padding: 2rem;
        box-sizing: border-box;
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1.25rem;
      }

      .card {
        display: flex;
        flex-direction: column;
        border-radius: 12px;
        overflow: hidden;
        text-decoration: none;
        background: #1a1a22;
        border: 1px solid rgba(255, 255, 255, 0.07);
        transition: transform 0.18s, border-color 0.18s, box-shadow 0.18s;
        cursor: pointer;
      }

      .card:hover {
        transform: translateY(-4px) scale(1.02);
        border-color: rgba(120, 160, 255, 0.4);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
      }

      .card:hover .play-overlay {
        opacity: 1;
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
        transition: opacity 0.18s;
      }

      .play-overlay svg {
        width: 48px;
        height: 48px;
      }

      .info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.6rem 0.75rem;
        gap: 0.5rem;
      }

      .name {
        font-size: 0.875rem;
        font-weight: 600;
        color: #e8e8f0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .tag {
        font-size: 0.7rem;
        font-weight: 500;
        color: rgba(120, 160, 255, 0.85);
        background: rgba(100, 140, 255, 0.12);
        border: 1px solid rgba(100, 140, 255, 0.25);
        border-radius: 4px;
        padding: 0.1rem 0.4rem;
        white-space: nowrap;
        flex-shrink: 0;
      }

      /* skeleton */
      .skeleton-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1.25rem;
      }

      .skeleton-card {
        aspect-ratio: 16 / 9;
        border-radius: 12px;
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
