import type { SpawnedElement } from '@/game/Decomposer/types';

export function decomposeText(element: HTMLElement, idPrefix: string): SpawnedElement[] {
  const text = element.textContent?.trim() ?? '';
  if (!text) {
    return [];
  }

  const glyphs = [...text].filter((char) => char.trim() !== '');
  const elementRect = element.getBoundingClientRect();
  const glyphWidth = Math.max(4, elementRect.width / Math.max(glyphs.length, 1));
  const elements: SpawnedElement[] = [];

  for (const [index, char] of glyphs.entries()) {
    const rect = getGlyphRect(element, index, char) ?? {
      left: elementRect.left + index * glyphWidth,
      top: elementRect.top,
      width: glyphWidth,
      height: elementRect.height,
    };

    elements.push({
      id: `${idPrefix}-glyph-${index}`,
      kind: 'text',
      shape: 'pyramid',
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      width: Math.max(4, rect.width),
      height: Math.max(4, rect.height),
      mass: 1,
    });
  }

  return elements;
}

function getGlyphRect(
  element: HTMLElement,
  index: number,
  char: string,
): Pick<DOMRect, 'left' | 'top' | 'width' | 'height'> | null {
  if (typeof document.createRange !== 'function') {
    return null;
  }

  const range = document.createRange();
  const textNode = findTextNode(element);
  if (!textNode) {
    return null;
  }

  const start = findCharOffset(textNode, char, index);
  const end = Math.min(textNode.textContent?.length ?? 0, start + 1);

  try {
    range.setStart(textNode, start);
    range.setEnd(textNode, end);
    if (typeof range.getClientRects !== 'function') {
      return null;
    }

    const rect = range.getClientRects()[0];
    if (!rect) {
      return null;
    }

    return rect;
  } catch {
    return null;
  }
}

function findTextNode(element: HTMLElement): Text | null {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  return walker.nextNode() as Text | null;
}

function findCharOffset(textNode: Text, char: string, index: number): number {
  const content = textNode.textContent ?? '';
  let seen = 0;

  for (let offset = 0; offset < content.length; offset += 1) {
    if (content[offset]?.trim() === '') {
      continue;
    }

    if (content[offset] === char && seen === index) {
      return offset;
    }

    seen += 1;
  }

  return Math.min(index, content.length);
}
