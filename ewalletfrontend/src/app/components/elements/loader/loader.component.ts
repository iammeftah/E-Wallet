// jelly-loader.component.ts
import { Component, Input } from '@angular/core';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-loader',
  template: `
    <div class="container" [ngClass]="{ 'dark': isDarkMode }">
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
    </div>
    <svg width="0" height="0" class="svg">
      <defs>
        <filter id="uib-jelly-ooze">
          <feGaussianBlur
            in="SourceGraphic"
            stdDeviation="3"
            result="blur"
          />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
            result="ooze"
          />
          <feBlend in="SourceGraphic" in2="ooze"/>
        </filter>
      </defs>
    </svg>
  `,
  imports: [
    NgClass
  ],
  styles: [`
    :host {
      display: block;
    }

    .container {
      --uib-size: 60px;
      --uib-color: black;
      --uib-speed: 2.6s;
      --uib-dot-size: calc(var(--uib-size) * 0.23);
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: var(--uib-size);
      height: var(--uib-dot-size);
      filter: url('#uib-jelly-ooze');
    }

    .container.dark {
      --uib-color: white;
    }

    @media (prefers-color-scheme: dark) {
      .container:not(.force-light) {
        --uib-color: white;
      }
    }

    .dot {
      position: absolute;
      top: calc(50% - var(--uib-dot-size) / 2);
      left: calc(0px - var(--uib-dot-size) / 2);
      display: block;
      height: var(--uib-dot-size);
      width: var(--uib-dot-size);
      border-radius: 50%;
      background-color: var(--uib-color);
      animation: stream var(--uib-speed) linear infinite both;
      transition: background-color 0.3s ease;
    }

    .dot:nth-child(2) {
      animation-delay: calc(var(--uib-speed) * -0.2);
    }

    .dot:nth-child(3) {
      animation-delay: calc(var(--uib-speed) * -0.4);
    }

    .dot:nth-child(4) {
      animation-delay: calc(var(--uib-speed) * -0.6);
    }

    .dot:nth-child(5) {
      animation-delay: calc(var(--uib-speed) * -0.8);
    }

    @keyframes stream {
      0%,
      100% {
        transform: translateX(0) scale(0);
      }
      50% {
        transform: translateX(calc(var(--uib-size) * 0.5)) scale(1);
      }
      99.999% {
        transform: translateX(calc(var(--uib-size))) scale(0);
      }
    }
  `]
})
export class LoaderComponent {
  @Input() isDarkMode: boolean = false;
}
