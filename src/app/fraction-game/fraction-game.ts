import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

const GAME_W = 960;
const GAME_H = 600;

@Component({
  selector: 'app-fraction-game',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(window:resize)': 'updateScale()' },
  template: `
    <div
      class="wrapper"
      [style.width.px]="GAME_W * scale()"
      [style.height.px]="GAME_H * scale()"
    >
      <iframe
        [src]="gameUrl"
        [style.transform]="'scale(' + scale() + ')'"
        title="Fraction"
        width="960"
        height="600"
        scrolling="no"
        frameborder="0"
        allowfullscreen
        style="transform-origin: top left; border: none; display: block"
      ></iframe>
    </div>
  `,
  styles: [
    `
      :host {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        background: #1a1a1a;
      }
      .wrapper {
        overflow: hidden;
      }
    `,
  ],
})
export class FractionGameComponent {
  private sanitizer = inject(DomSanitizer);
  protected readonly GAME_W = GAME_W;
  protected readonly GAME_H = GAME_H;
  protected readonly gameUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    'assets/Fraction/index.html',
  );
  protected readonly scale = signal(this.computeScale());

  protected updateScale(): void {
    this.scale.set(this.computeScale());
  }

  private computeScale(): number {
    return Math.min(window.innerWidth / GAME_W, window.innerHeight / GAME_H);
  }
}
