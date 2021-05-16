var spoilerInput = document.getElementById("spoilerInput");
var spoilerContainer = document.getElementById("spoilerContainer");
var spoilerTerms = [];

//Updating initialized array
chrome.storage.sync.get(["sTerms"], (data) => {
    spoilerContainer = document.getElementById("spoilerContainer");
    spoilerTerms = data.sTerms;
});

spoilerInput.addEventListener("keydown", event => {
    if (event.keyCode === 13) {
        const spoiler = spoilerInput.nodeValue;
        console.log("entered word " + spoiler);
        if (!spoiler || spoiler.length === 1) {
            //error statements
        } else if (spoilerTerms.includes(spoiler)) {
            //error because term is already spoiled
        } else {
            spoilerTerms.push(spoiler);
            chrome.storage.sync.set({sTerms: spoilerTerms}, () => {
                console.log("Spoiler term: " + spoiler + " added");
                updateList(spoilerTerms);
            });
        }
    }
});

function updateList(ul) {
    let items = {};
    deleteList(spoilerContainer);
    console.log(ul);
    ul.forEach((spoiler) => {
        items = document.createElement("li");
        items.className = "itemStyle";
        items.appendChild(document.createTextNode(spoiler));
        items.addEventListener("mouseover", (event) => {
            const click = event.target || event.srcElement;
            click.style.color = "red";
        });
        items.addEventListener("mouseout", (event) => {
            const click = event.target || event.srcElement;
            click.style.color = "white";
        });
        items.addEventListener("click", (event) => {
            const click = event.target || event.srcElement;
            const click_text = click.textContent;
            let index = spoilerTerms.indexOf(click_text);
            if (index > -1) {
                spoilerTerms.splice(index, 1);
            }
            updateList(spoilerTerms);
            chrome.storage.sync.set({ sTerms: spoilerTerms}, () => {
                console.log("Updates spoilers");
            });
        });
        spoilerContainer.appendChild(items);
    })
}

function deleteList(element) {
    console.log(element);
    while (element.firstChild) {
        element.removeChild(element.lastChild);
    }
}