/**
 * portfolio/src/utils.js
 * index.html から抽出したピュア関数群（テスト可能）
 */

export const ALLOWED_IMG_EXTS = /\.(png|jpe?g|webp|gif|avif|svg)(\?.*)?$/i;

/**
 * src が同一オリジン かつ 許可拡張子 か検証する
 * @param {string} src
 * @param {string} [base] - テスト時に origin を注入できるよう引数化
 * @returns {boolean}
 */
export function isSafeImageSrc(src, base = 'https://example.com') {
  try {
    const url = new URL(src, base);
    const baseUrl = new URL(base);
    return url.origin === baseUrl.origin && ALLOWED_IMG_EXTS.test(url.pathname);
  } catch (_err) {
    return false;
  }
}

/**
 * カテゴリフィルタリング: カード要素をカテゴリで表示/非表示する
 * @param {HTMLElement[]} cards
 * @param {string} category  'all' | 'web' | 'app' | 'game'
 */
export function filterCards(cards, category) {
  cards.forEach(card => {
    const match = category === 'all' || card.dataset.category === category;
    card.style.display = match ? '' : 'none';
  });
}

/**
 * reveal ステガー遅延の計算
 * @param {number} index       全体インデックス
 * @param {number} columns     グリッド列数
 * @param {number} stepSec     1列あたりの遅延秒数
 * @returns {number}           遅延秒数
 */
export function calcRevealDelay(index, columns, stepSec) {
  return (index % columns) * stepSec;
}
