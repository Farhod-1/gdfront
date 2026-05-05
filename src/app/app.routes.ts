import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./games-list/games-list').then((m) => m.GamesListComponent),
  },
  {
    path: 'kornizka',
    loadComponent: () => import('./game/game').then((m) => m.GameComponent),
    data: {
      name: 'Kornizka',
      assetUrl: 'http://localhost:3000/games/Kornizka/index.html',
    },
  },
  {
    path: 'fractions',
    loadComponent: () => import('./game/game').then((m) => m.GameComponent),
    data: {
      name: 'Fractions',
      assetUrl: 'http://localhost:3000/games/Fractions/index.html',
    },
  },
  { path: '**', redirectTo: '' },
];
