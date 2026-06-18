const activeTabs = new Set<number>();

export function markTabActive(tabId: number): void {
  activeTabs.add(tabId);
}

export function markTabInactive(tabId: number): void {
  activeTabs.delete(tabId);
}

export function isTabActive(tabId: number): boolean {
  return activeTabs.has(tabId);
}

export function getActiveTabs(): number[] {
  return [...activeTabs];
}
