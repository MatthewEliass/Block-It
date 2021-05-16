//Initializing arrays
var spoilerTerms = [];

console.log("hi");

//Updating initialized arrays
chrome.storage.onChanged.addListener(() => {
    console.log("change received");
    chrome.storage.sync.get(["sTerms"], (data) => {
        spoilerTerms = data.sTerms;
        console.log("storage get");
        console.log(data);
        startScript();
    });
});

//
const begin = () => {blockWord(document.body);};

//Interval timer allows continuous blocking of spoiler terms while page changes
// i.e: Scrolling through YouTube comments, as more comments load, spoiler terms keep being blocked
const beginTiming = () => {setInterval(begin, 10000);};

function startScript() {
    begin();
    beginTiming();
}

function replaceWord(word, spoiler) {
    var specials = new RegExp(/[-\/\\^$*+?.()|[\]{}]/g)
    const pattern = spoiler.replace(specials, "\\$&");

    return word.replace(new RegExp(pattern, "gi"), "⬛".repeat(spoiler.length));
}

//Recursive approach to loop through every element on the page
function blockWord(element) {
    if (element.hasChildNodes()) {
        element.childNodes.forEach(blockWord);
    } else if (element.nodeType  == Text.TEXT_NODE) {
        if (spoilerTerms) {
            spoilerTerms.forEach((term) => {
                console.log(term);
                element.textContent = replaceWord(element.textContent, term);
            });
        }
    }
}