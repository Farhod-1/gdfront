import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Game {
  id: string;
  name: string;
  path: string;
}

@Component({
  selector: 'app-games-list',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main>
      <h1>Games</h1>
      <div class="games-grid">
        @for (game of games; track game.id) {
          <a [routerLink]="game.path" class="game-card">
            <span class="game-name">{{ game.name }}</span>
          </a>
        }
      </div>
    </main>
  `,
  styles: [
    `
      :host {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background: #111;
        font-family: sans-serif;
      }
      main {
        text-align: center;
      }
      h1 {
        color: #fff;
        font-size: 2rem;
        margin-bottom: 2rem;
        font-weight: 600;
        letter-spacing: 0.05em;
      }
      .games-grid {
        display: flex;
        gap: 1.5rem;
        justify-content: center;
        flex-wrap: wrap;
      }
      .game-card {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 200px;
        height: 120px;
        background: #1e1e1e;
        border: 1px solid #333;
        border-radius: 12px;
        text-decoration: none;
        transition: border-color 0.2s, background 0.2s;
        cursor: pointer;
      }
      .game-card:hover {
        border-color: #888;
        background: #2a2a2a;
      }
      .game-card:focus-visible {
        outline: 2px solid #888;
        outline-offset: 2px;
      }
      .game-name {
        color: #e0e0e0;
        font-size: 1.1rem;
        font-weight: 500;
      }
    `,
  ],
})
export class GamesListComponent {
  protected readonly games: Game[] = [
    { id: 'kornizka', name: 'Kornizka', path: '/kornizka' },
    { id: 'fraction', name: 'Fraction', path: '/fraction' },
  ];
}
