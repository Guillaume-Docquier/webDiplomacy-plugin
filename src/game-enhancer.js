const MAP_WRAPPER_ID = "mapstore";
const MAP_IMG_ID = "mapImage";
const RESIZE_BUTTON_ID = "resizeButton";

const MapSize = {
    SMALL: "small",
    LARGE: "large"
};

function toggleMapSize() {
    const mapImage = document.getElementById(MAP_IMG_ID);
    if (mapImage.src.includes(MapSize.SMALL)) {
        mapImage.src = mapImage.src.replace(MapSize.SMALL, MapSize.LARGE);
    }
    else if (mapImage.src.includes(MapSize.LARGE)) {
        mapImage.src = mapImage.src.replace(MapSize.LARGE, MapSize.SMALL);
    }
    else {
        mapImage.src = `${mapImage.src}&mapType=${MapSize.LARGE}`;
    }
}

function addMapControls() {
    const mapWrapper = document.getElementById(MAP_WRAPPER_ID);
    mapWrapper.style.display = "flex";
    mapWrapper.style.alignItems = "center";
    mapWrapper.style.flexDirection = "column";

    const controls = mapWrapper.getElementsByTagName("p")[0];
    controls.style.display = "flex";
    controls.style.alignItems = "center";

    const resizeUrl = chrome.runtime.getURL("images/resize.png");
    const resizeControlDomString = `
        <a id="${RESIZE_BUTTON_ID}" class="mapnav" href="#${MAP_WRAPPER_ID}">
            <img id="Resize" src="${resizeUrl}" width="12px" height="12px" alt="Resize" title="Toggle map size">
        </a>
    `;
    controls.insertAdjacentHTML('beforeend', resizeControlDomString);
    document.getElementById(RESIZE_BUTTON_ID).onclick = toggleMapSize;
}

function widenPage() {
    const pageHeader = document.getElementById("header-container");
    pageHeader.style.maxWidth = "1348px";

    const contentHeader = document.getElementsByClassName("content-board-header")[0];
    contentHeader.style.maxWidth = "1348px";

    const content = document.getElementsByClassName("content-follow-on")[0];
    content.style.maxWidth = "1300px";
}

function moveChatboxAnchor() {
    const chatboxAnchor = document.getElementsByName("chatboxanchor")[0];
    chatboxAnchor.style.display = "block";
    chatboxAnchor.style.position = "relative";
    chatboxAnchor.style.top = "-178px";
}

console.log("Running webDiplomacy-plugin/game-enhancer");
toggleMapSize();
addMapControls();
widenPage();
moveChatboxAnchor();