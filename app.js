let items = [];
let settings = {};
let searchTerms = [];

let inventoryMode = false;
let hiddenMode = false;

let currentUser = null;

// -----------------------------
// INIT
// -----------------------------
document.addEventListener("DOMContentLoaded", async () => {
    await loadSession();
    await loadSettings();
    await loadItems();

    setupSearch();
    setupInventoryToggle();
    setupHiddenToggle();
    setupUIButtons();
});

// -----------------------------
// SESSION
// -----------------------------
async function loadSession() {
    const res = await fetch("/functions/session");
    if (res.ok) {
        currentUser = await res.json();
    } else {
        window.location.href = "/";
    }
}

// -----------------------------
// SETTINGS
// -----------------------------
async function loadSettings() {
    const res = await fetch("/functions/settings");
    if (res.ok) {
        settings = await res.json();
    }
}

// -----------------------------
// ITEMS
// -----------------------------
async function loadItems() {
    const res = await fetch("/functions/items");
    items = await res.json();
    renderItems();
}

// -----------------------------
// SEARCH PILLS (FIXED)
// -----------------------------
function setupSearch() {
    const input = document.getElementById("searchInput");

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const value = input.value.trim();
            if (!value) return;

            searchTerms.push(value);
            input.value = "";

            renderSearchPills();
            renderItems();
        }
    });
}

function renderSearchPills() {
    const container = document.getElementById("searchPills");
    container.innerHTML = "";

    searchTerms.forEach((term, index) => {
        const pill = document.createElement("button");
        pill.className = "search-pill";
        pill.textContent = term;

        pill.onclick = () => {
            // restore full term safely (NO character loss bug)
            searchTerms.splice(index, 1);
            document.getElementById("searchInput").value = term;

            renderSearchPills();
            renderItems();
        };

        container.appendChild(pill);
    });
}

// -----------------------------
// INVENTORY MODE (SECRET WORD)
// -----------------------------
function setupInventoryToggle() {
    const subtitle = document.getElementById("subtitle");

    subtitle.innerHTML = `
        <span id="inventoryWord">inventory</span>
        mode active
    `;

    document.addEventListener("click", (e) => {
        if (e.target.id === "inventoryWord") {
            inventoryMode = !inventoryMode;
            renderItems();
            setupUIButtons();
        }
    });
}

// -----------------------------
// HIDDEN MODE (INVISIBLE BUTTON)
// -----------------------------
function setupHiddenToggle() {
    const btn = document.getElementById("hiddenToggle");

    if (!btn) return;

    btn.onclick = () => {
        hiddenMode = !hiddenMode;
        renderItems();
    };
}

// -----------------------------
// UI CONTROL VISIBILITY
// -----------------------------
function setupUIButtons() {
    const addBtn = document.getElementById("addItemBtn");
    const publicBtn = document.getElementById("publicToggle");

    if (inventoryMode) {
        addBtn.style.display = "inline-block";
        publicBtn.style.display = "inline-block";
    } else {
        addBtn.style.display = "none";
        publicBtn.style.display = "none";
    }
}

// -----------------------------
// ITEM FILTER LOGIC
// -----------------------------
function matchesSearch(item) {
    if (searchTerms.length === 0) return true;

    const text = `
        ${item.name}
        ${item.type}
        ${item.location}
        ${item.details}
    `.toLowerCase();

    return searchTerms.every(term =>
        text.includes(term.toLowerCase())
    );
}

// -----------------------------
// RENDER ITEMS
// -----------------------------
function renderItems() {
    const grid = document.getElementById("itemGrid");
    grid.innerHTML = "";

    let filtered = items.filter(item => {

        // hidden logic
        if (item.hidden && !hiddenMode) {
            return false;
        }

        // search logic
        if (!matchesSearch(item)) {
            return false;
        }

        return true;
    });

    // sort
    filtered = sortItems(filtered);

    // photo grouping (placeholder hook)
    if (settings.photo_first) {
        const withPhotos = filtered.filter(i => i.image_key);
        const withoutPhotos = filtered.filter(i => !i.image_key);
        filtered = [...withPhotos, ...withoutPhotos];
    }

    filtered.forEach(item => {
        const card = document.createElement("div");
        card.className = "item-card";

        if (item.hidden) {
            card.classList.add("hidden-item");
        }

        if (item.in_use) {
            card.classList.add("in-use");
        }

        const img = item.image_key
            ? `<img src="/functions/image?key=${item.image_key}">`
            : "";

        const controls =
            inventoryMode
                ? `
                <div class="controls">
                    <button>Edit</button>
                    <button>Delete</button>
                    <button>
                        ${item.in_use ? "In Use" : "Use"}
                    </button>
                </div>
                `
                : "";

        const hiddenTag =
            item.hidden
                ? `<small>Hidden</small>`
                : "";

        card.innerHTML = `
            ${img}
            <div class="item-content">
                <h3>${item.name}</h3>
                <p>${item.location}</p>
                <p>${item.type}</p>
                ${hiddenTag}
                ${controls}
            </div>
        `;

        grid.appendChild(card);
    });

    document.getElementById("subtitle").innerText =
        `${filtered.length} items in your home inventory`;
}

// -----------------------------
// SORTING
// -----------------------------
function sortItems(list) {
    const mode = settings.sort_mode || "alphabetical";

    if (mode === "created") {
        return list.sort((a, b) =>
            a.id - b.id
        );
    }

    // default alphabetical
    return list.sort((a, b) =>
        a.name.localeCompare(b.name)
    );
}

// -----------------------------
// PLACEHOLDER BUTTONS
// -----------------------------
function setupUIButtons() {
    const addBtn = document.getElementById("addItemBtn");
    const publicBtn = document.getElementById("publicToggle");
    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {
        logoutBtn.onclick = async () => {
            await fetch("/functions/logout", {
                method: "POST"
            });
            window.location.href = "/";
        };
    }

    if (inventoryMode) {
        addBtn.style.display = "inline-block";
        publicBtn.style.display = "inline-block";
    } else {
        addBtn.style.display = "none";
        publicBtn.style.display = "none";
    }
}
