// @vitest-environment jsdom
/**
 * portfolio/src/utils.test.js
 * isSafeImageSrc / filterCards / calcRevealDelay のユニットテスト
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { isSafeImageSrc, filterCards, calcRevealDelay } from './utils.js';

// ─────────────────────────────────────────────
// isSafeImageSrc
// ─────────────────────────────────────────────
describe('isSafeImageSrc', () => {
  const BASE = 'https://example.com';

  // ✅ 正常系 — 同一オリジン + 許可拡張子
  it('同一オリジンの .webp を許可する', () => {
    expect(isSafeImageSrc('https://example.com/img/photo.webp', BASE)).toBe(true);
  });
  it('同一オリジンの .png を許可する', () => {
    expect(isSafeImageSrc('https://example.com/img/photo.png', BASE)).toBe(true);
  });
  it('同一オリジンの .jpg を許可する', () => {
    expect(isSafeImageSrc('https://example.com/img/photo.jpg', BASE)).toBe(true);
  });
  it('同一オリジンの .jpeg を許可する', () => {
    expect(isSafeImageSrc('https://example.com/img/photo.jpeg', BASE)).toBe(true);
  });
  it('同一オリジンの .gif を許可する', () => {
    expect(isSafeImageSrc('https://example.com/img/photo.gif', BASE)).toBe(true);
  });
  it('同一オリジンの .avif を許可する', () => {
    expect(isSafeImageSrc('https://example.com/img/photo.avif', BASE)).toBe(true);
  });
  it('同一オリジンの .svg を許可する', () => {
    expect(isSafeImageSrc('https://example.com/img/icon.svg', BASE)).toBe(true);
  });
  it('クエリパラメータ付き URL も許可する', () => {
    expect(isSafeImageSrc('https://example.com/img/photo.webp?v=2', BASE)).toBe(true);
  });
  it('相対パス の .webp を許可する', () => {
    expect(isSafeImageSrc('image/photo.webp', BASE)).toBe(true);
  });

  // ❌ 異常系 — 別オリジン
  it('別オリジンの画像を拒否する', () => {
    expect(isSafeImageSrc('https://evil.com/steal.webp', BASE)).toBe(false);
  });
  it('サブドメインも別オリジンとして拒否する', () => {
    expect(isSafeImageSrc('https://cdn.example.com/photo.webp', BASE)).toBe(false);
  });

  // ❌ 異常系 — 危険スキーム
  it('javascript: スキームを拒否する', () => {
    expect(isSafeImageSrc('javascript:alert(1)', BASE)).toBe(false);
  });
  it('data: スキームを拒否する', () => {
    expect(isSafeImageSrc('data:text/html,<script>alert(1)</script>', BASE)).toBe(false);
  });

  // ❌ 異常系 — 許可外拡張子
  it('.html ファイルを拒否する', () => {
    expect(isSafeImageSrc('https://example.com/page.html', BASE)).toBe(false);
  });
  it('.exe ファイルを拒否する', () => {
    expect(isSafeImageSrc('https://example.com/virus.exe', BASE)).toBe(false);
  });
  it('拡張子なし URL を拒否する', () => {
    expect(isSafeImageSrc('https://example.com/image', BASE)).toBe(false);
  });

  // ❌ 異常系 — 不正 URL
  it('空文字を安全でないとみなす', () => {
    expect(isSafeImageSrc('', BASE)).toBe(false);
  });
  it('不正な URL 文字列を安全でないとみなす', () => {
    expect(isSafeImageSrc(':::invalid:::', BASE)).toBe(false);
  });
});

// ─────────────────────────────────────────────
// filterCards
// ─────────────────────────────────────────────
describe('filterCards', () => {
  /** @type {HTMLElement[]} */
  let cards;

  beforeEach(() => {
    // dataset は getter-only なので setAttribute で設定する
    const make = (cat) => {
      const el = document.createElement('div');
      el.setAttribute('data-category', cat);
      return el;
    };
    cards = [make('web'), make('app'), make('game'), make('web')];
  });

  it('"all" のとき全カードを表示する', () => {
    filterCards(cards, 'all');
    expect(cards.every(c => c.style.display !== 'none')).toBe(true);
  });

  it('"web" のとき web カードのみ表示する', () => {
    filterCards(cards, 'web');
    expect(cards[0].style.display).not.toBe('none');  // web
    expect(cards[1].style.display).toBe('none');       // app
    expect(cards[2].style.display).toBe('none');       // game
    expect(cards[3].style.display).not.toBe('none');  // web
  });

  it('"app" のとき app カードのみ表示する', () => {
    filterCards(cards, 'app');
    expect(cards[0].style.display).toBe('none');
    expect(cards[1].style.display).not.toBe('none');
    expect(cards[2].style.display).toBe('none');
  });

  it('"game" のとき game カードのみ表示する', () => {
    filterCards(cards, 'game');
    expect(cards[2].style.display).not.toBe('none');
    expect(cards[0].style.display).toBe('none');
  });

  it('存在しないカテゴリでは全カードを非表示にする', () => {
    filterCards(cards, 'unknown');
    expect(cards.every(c => c.style.display === 'none')).toBe(true);
  });
});

// ─────────────────────────────────────────────
// calcRevealDelay
// ─────────────────────────────────────────────
describe('calcRevealDelay', () => {
  it('1列目（index=0）は遅延ゼロ', () => {
    expect(calcRevealDelay(0, 3, 0.09)).toBe(0);
  });
  it('2列目（index=1）は 0.09s', () => {
    expect(calcRevealDelay(1, 3, 0.09)).toBeCloseTo(0.09);
  });
  it('3列目（index=2）は 0.18s', () => {
    expect(calcRevealDelay(2, 3, 0.09)).toBeCloseTo(0.18);
  });
  it('4番目（index=3）は折り返して 0s', () => {
    expect(calcRevealDelay(3, 3, 0.09)).toBe(0);
  });
  it('5番目（index=4）は 0.09s', () => {
    expect(calcRevealDelay(4, 3, 0.09)).toBeCloseTo(0.09);
  });
});
