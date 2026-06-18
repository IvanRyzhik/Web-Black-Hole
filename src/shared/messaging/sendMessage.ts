import {
  isExtensionMessage,
  type ExtensionMessage,
} from '@/shared/messaging/types';

type MessageResponse = unknown;

type MessageListener = (
  message: ExtensionMessage,
  sender: chrome.runtime.MessageSender,
) => MessageResponse | Promise<MessageResponse>;

export async function sendTabMessage<TResponse>(
  tabId: number,
  message: ExtensionMessage,
): Promise<TResponse | undefined> {
  try {
    return (await chrome.tabs.sendMessage(tabId, message)) as TResponse | undefined;
  } catch {
    return undefined;
  }
}

export async function sendRuntimeMessage<TResponse>(
  message: ExtensionMessage,
): Promise<TResponse | undefined> {
  return (await chrome.runtime.sendMessage(message)) as TResponse | undefined;
}

export function onMessage(listener: MessageListener): void {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (!isExtensionMessage(message)) {
      return;
    }

    const result = listener(message, sender);
    if (result instanceof Promise) {
      void result.then((response) => sendResponse(response ?? { ok: true }));
      return true;
    }

    sendResponse(result ?? { ok: true });
    return true;
  });
}

export { isExtensionMessage };
export type { ExtensionMessage };
