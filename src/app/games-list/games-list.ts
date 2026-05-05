import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { GamesService } from '../games.service';

@Component({
  selector: 'app-games-list',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg"></div>
    <main>
      <header>
        <h1>Choose a Game</h1>
      </header>
      <div class="grid">
        @if (games() === undefined) {
          <p class="status">Loading…</p>
        } @else if (games()!.length === 0) {
          <p class="status">No games found.</p>
        } @else {
          @for (game of games()!; track game.id) {
            <a [routerLink]="game.path" class="card" [attr.aria-label]="'Play ' + game.name">
              <div class="card-icon">
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <circle cx="24" cy="24" r="22" stroke="currentColor" stroke-width="2"/>
                  <polygon points="19,15 35,24 19,33" fill="currentColor"/>
                </svg>
              </div>
              <div class="card-body">
                <span class="card-title">{{ game.name }}</span>
                <span class="card-desc">{{ game.description }}</span>
              </div>
              <div class="card-arrow" aria-hidden="true">›</div>
            </a>
          }
        }
      </div>
    </main>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        position: relative;
        font-family: 'Segoe UI', system-ui, sans-serif;
      }

      .bg {
        position: absolute;
        inset: 0;
        background: radial-gradient(ellipse at 30% 20%, #1a2540 0%, #0a0a0f 60%);
        z-index: 0;
      }

      main {
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        padding: 2rem;
        box-sizing: border-box;
        gap: 3rem;
      }

      header h1 {
        margin: 0;
        font-size: clamp(1.8rem, 4vw, 3rem);
        font-weight: 700;
        letter-spacing: 0.04em;
        color: #fff;
        text-shadow: 0 0 40px rgba(100, 160, 255, 0.4);
      }

      .grid {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
        width: 100%;
        max-width: 560px;
      }

      .status {
        color: rgba(255, 255, 255, 0.4);
        font-size: 1rem;
        text-align: center;
      }

      .card {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        padding: 1.5rem 2rem;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 16px;
        text-decoration: none;
        cursor: pointer;
        transition: background 0.2s, border-color 0.2s, transform 0.15s;
        backdrop-filter: blur(8px);
      }

      .card:hover {
        background: rgba(255, 255, 255, 0.09);
        border-color: rgba(100, 160, 255, 0.5);
        transform: translateY(-2px);
      }

      .card:focus-visible {
        outline: 2px solid rgba(100, 160, 255, 0.8);
        outline-offset: 3px;
      }

      .card-icon {
        flex-shrink: 0;
        width: 52px;
        height: 52px;
        color: rgba(100, 160, 255, 0.85);
      }

      .card-icon svg {
        width: 100%;
        height: 100%;
      }

      .card-body {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
      }

      .card-title {
        font-size: 1.25rem;
        font-weight: 600;
        color: #fff;
      }

      .card-desc {
        font-size: 0.875rem;
        color: rgba(255, 255, 255, 0.45);
      }

      .card-arrow {
        font-size: 1.75rem;
        color: rgba(255, 255, 255, 0.3);
        transition: color 0.2s, transform 0.2s;
        line-height: 1;
      }

      .card:hover .card-arrow {
        color: rgba(100, 160, 255, 0.8);
        transform: translateX(4px);
      }
    `,
  ],
})
export class GamesListComponent {
  protected readonly games = toSignal(inject(GamesService).getGames());
}
