import { getActiveTabs, markTabActive, markTabInactive } from '@/background/tabState';
import { MessageType } from '@/shared/messaging/types';
import { onMessage, sendTabMessage } from '@/shared/messaging/sendMessage';
import { loadSettings } from '@/shared/settings/storage';

onMessage(async (message, sender) => {
  const tabId = sender.tab?.id;

  switch (message.type) {
    case MessageType.START_GAME: {
      if (tabId === undefined) {
        return;
      }

      markTabActive(tabId);
      await sendTabMessage(tabId, message);
      break;
    }
    case MessageType.STOP_GAME: {
      if (tabId === undefined) {
        for (const activeTabId of getActiveTabs()) {
          await sendTabMessage(activeTabId, message);
          markTabInactive(activeTabId);
        }
        return;
      }

      markTabInactive(tabId);
      await sendTabMessage(tabId, message);
      break;
    }
    case MessageType.GET_STATUS: {
      return {
        active:
          tabId !== undefined
            ? getActiveTabs().includes(tabId)
            : getActiveTabs().length > 0,
      };
    }
    default:
      break;
  }
});

chrome.runtime.onInstalled.addListener(() => {
  void loadSettings();
});

chrome.tabs.onRemoved.addListener((tabId) => {
  markTabInactive(tabId);
});
