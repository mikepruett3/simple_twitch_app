console.log("Loot Collector init");
chrome.storage.local.get("isEnabled", (data) => {
    if (data.isEnabled === undefined) {
        chrome.storage.local.set({ isEnabled: true });
    }
})
const querySelector = 'button[aria-label="Claim Bonus"]';

setInterval(() => {
  chrome.storage.local.get("isEnabled", (data) => {
    const { isEnabled } = data;
    if (isEnabled) {
      const loot = document.querySelector(querySelector);
      if (loot) {
        loot.click();
      }
    }
  });
}, 5000);
