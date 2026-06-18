import { decomposeButton } from '@/game/Decomposer/ButtonDecomposer';
import { classifyElement } from '@/game/Decomposer/classifyElement';
import {
  isEmptyRegion,
  sampleElementRegion,
} from '@/game/Decomposer/EmptyRegionDetector';
import { decomposeImage } from '@/game/Decomposer/ImageDecomposer';
import { decomposeText } from '@/game/Decomposer/TextDecomposer';
import type { DecomposeResult, SpawnedElement } from '@/game/Decomposer/types';
import { MAX_ELEMENTS, MIN_ELEMENT_SIZE_PX } from '@/game/constants';
import { isVisibleInViewport } from '@/shared/utils/dom';

const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME', 'SVG']);

export class DecomposerRegistry {
  decompose(root: ParentNode = document.body): DecomposeResult {
    const elements: SpawnedElement[] = [];
    const candidates = collectCandidates(root);

    for (const [index, element] of candidates.entries()) {
      if (elements.length >= MAX_ELEMENTS) {
        break;
      }

      const spawned = this.decomposeElement(element, `el-${index}`);
      elements.push(...spawned);
    }

    return {
      elements: elements.slice(0, MAX_ELEMENTS),
      totalElements: elements.length,
    };
  }

  decomposeElement(element: HTMLElement, idPrefix: string): SpawnedElement[] {
    if (!isVisibleInViewport(element)) {
      return [];
    }

    const rect = element.getBoundingClientRect();
    if (rect.width < MIN_ELEMENT_SIZE_PX || rect.height < MIN_ELEMENT_SIZE_PX) {
      return [];
    }

    const kind = classifyElement(element);

    if (kind === 'unknown') {
      const sample = sampleElementRegion(element);
      if (sample && isEmptyRegion(sample)) {
        return [];
      }
      return [];
    }

    switch (kind) {
      case 'button':
        return decomposeButton(element, idPrefix);
      case 'text':
        return decomposeText(element, idPrefix);
      case 'image':
        return decomposeImage(element, idPrefix);
      default:
        return [];
    }
  }
}

function collectCandidates(root: ParentNode): HTMLElement[] {
  const treeWalker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
  const result: HTMLElement[] = [];

  while (treeWalker.nextNode()) {
    const node = treeWalker.currentNode;
    if (!(node instanceof HTMLElement)) {
      continue;
    }

    if (SKIP_TAGS.has(node.tagName) || node.dataset.blackHoleUi !== undefined) {
      continue;
    }

    result.push(node);
  }

  return result;
}
