
document.addEventListener("DOMContentLoaded", () => {
    const scrapeEmailsBtn = document.getElementById('scrapeEmails');
    const emailList = document.getElementById('emailList');

    // Handler to receive emails from content script
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        // Get emails
        let emails = request.emails;
        // Display emails on popup
        if (emails == null || emails.length === 0) {
            // No emails
            let li = document.createElement('li');
            li.innerText = "No emails Found";
            emailList.appendChild(li); // Append to the email list
        } else {
            // Display emails
            emails.forEach((email) => {
                let li = document.createElement('li');
                li.innerText = email;
                emailList.appendChild(li); // Append to the email list
            });
        }
    });

    scrapeEmailsBtn.addEventListener("click", async () => {
        // Get current active tab
        let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        // Execute script to parse emails on page
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: scrapeEmailsFromPage,
        });
    });

    // Function to scrape emails
    function scrapeEmailsFromPage() {
        const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
        // Parse emails from the HTML of the page
        let emails = document.body.innerHTML.match(emailRegex);

        // Send emails to popup
        chrome.runtime.sendMessage({ emails });
    }
});
