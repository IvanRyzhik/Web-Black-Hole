import '@webext-core/fake-browser/auto';
import { beforeEach } from 'vitest';

beforeEach(() => {
  chrome.storage.sync.clear();
});
