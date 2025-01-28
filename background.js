
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    // Define the regex pattern for job-related URLs
    const jobUrlPattern = /https:\/\/.*\/jobs\/(\d+)|https:\/\/jobs\.company\.com\/view\/(\d+)/;
    const match = tab.url.match(jobUrlPattern);

    if (match) {
      const jobId = match[1] || match[2]; // Extract the job ID
      const currentTimestamp = new Date().toLocaleString();

      // Retrieve previously stored data from Chrome storage
      chrome.storage.local.get("jobVisits", (data) => {
        const jobVisits = data.jobVisits || {};

        // Check if the job ID has been visited before
        if (jobVisits[jobId]) {
          const lastVisit = jobVisits[jobId];
          chrome.notifications.create({
            type: "basic",
            iconUrl: chrome.runtime.getURL("icon.png"),
            title: "Job Page Visited Again",
            message: `You last visited Job ID ${jobId} on ${lastVisit}.`,
          });
        } else {
          chrome.notifications.create({
            type: "basic",
            iconUrl: chrome.runtime.getURL("icon.png"),
            title: "First Time Visit",
            message: `You are visiting Job ID ${jobId} for the first time.`,
          });
        }

        // Update the storage with the current visit
        jobVisits[jobId] = currentTimestamp;
        chrome.storage.local.set({ jobVisits });
      });
    }
  }
});
