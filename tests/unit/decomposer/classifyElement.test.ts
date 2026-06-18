import { describe, expect, it } from 'vitest';
import { classifyElement } from '@/game/Decomposer/classifyElement';

describe('classifyElement', () => {
  it('detects buttons and links', () => {
    const button = document.createElement('button');
    button.textContent = 'Play';
    expect(classifyElement(button)).toBe('button');

    const link = document.createElement('a');
    link.href = '#';
    expect(classifyElement(link)).toBe('button');
  });

  it('detects images and text', () => {
    const image = document.createElement('img');
    expect(classifyElement(image)).toBe('image');

    const paragraph = document.createElement('p');
    paragraph.textContent = 'Hello';
    expect(classifyElement(paragraph)).toBe('text');
  });
});
