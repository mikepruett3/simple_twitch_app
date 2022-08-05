let onOff = document.getElementById("onoffswitch")

chrome.storage.local.get("isEnabled", (data) => {
  const isEnabled = !!data.isEnabled
  onOff.checked = isEnabled
})


onOff.addEventListener("change", (evt) => {
  chrome.storage.local.set({ isEnabled: evt.target.checked });
})
