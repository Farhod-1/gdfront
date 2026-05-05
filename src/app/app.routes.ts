import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./games-list/games-list').then((m) => m.GamesListComponent),
  },
  {
    path: 'kornizka',
    loadComponent: () =>
      import('./kornizka-game/kornizka-game').then((m) => m.KornizkaGameComponent),
  },
  {
    path: 'fraction',
    loadComponent: () =>
      import('./fraction-game/fraction-game').then((m) => m.FractionGameComponent),
  },
  { path: '**', redirectTo: '' },
];
