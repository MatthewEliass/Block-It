chrome.runtime.onInstalled.addListener(() => {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([
            {
                conditions: [new chrome.declarativeContent.PageStateMatcher({})],
                actions: [new chrome.declarativeContent.ShowPageAction()],
            },
        ]);
    });


    //storage object being setup
    //sTerms are spoiler keywords chosen to be blocked by the user
    chrome.storage.sync.set({ sTerms: [] }, function() {
        console.log("Terms have been created");
    });
});

// Sets a context menu for when the user right-clicks a term to block
var contextMenuItem = {
    "id": "sTerm",
    "title": "Block This Word",
    "contexts": ["selection"]
};

// Creates the context menu above
chrome.contextMenus.create(contextMenuItem);

// Updates spoiler terms with the new keyword when user blocks it with context menu
chrome.contextMenus.onClicked.addListener((data, tab) => {
    if ("selectionText" in data && !data["selectionText"].includes(" ")) {
        chrome.storage.sync.get(["sTerms"], (words) => {
            if (!words.sTerms.includes(data["selectionText"])) {
                words.sTerms.push(data["selectionText"]);
                chrome.storage.sync.set({ sTerms: words.sTerms }, () => 
                console.log("Updated spoiler terms"));
            }
        });
    }
});



