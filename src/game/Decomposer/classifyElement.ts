import type { ElementKind } from '@/game/Decomposer/types';

const BUTTON_TAGS = new Set(['BUTTON', 'A', 'INPUT', 'SUMMARY']);

export function classifyElement(element: Element): ElementKind {
  if (!(element instanceof HTMLElement)) {
    return 'unknown';
  }

  if (isButtonLike(element)) {
    return 'button';
  }

  if (element.tagName === 'IMG') {
    return 'image';
  }

  if (hasTextContent(element)) {
    return 'text';
  }

  if (hasBackgroundImage(element)) {
    return 'image';
  }

  return 'unknown';
}

function isButtonLike(element: HTMLElement): boolean {
  if (BUTTON_TAGS.has(element.tagName)) {
    if (element.tagName === 'INPUT') {
      const type = element.getAttribute('type')?.toLowerCase();
      return type === 'button' || type === 'submit' || type === 'reset';
    }
    return true;
  }

  return element.getAttribute('role') === 'button';
}

function hasTextContent(element: HTMLElement): boolean {
  const text = element.textContent?.trim() ?? '';
  return text.length > 0;
}

function hasBackgroundImage(element: HTMLElement): boolean {
  const background = getComputedStyle(element).backgroundImage;
  return background !== 'none' && background.includes('url(');
}
