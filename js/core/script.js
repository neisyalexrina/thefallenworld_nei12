// ===================== CORE RENDER ===================== //
function renderDataSection({ data, containerSelector, template }) {
  const container = document.querySelector(containerSelector);
  if (!container || !Array.isArray(data)) return;

  container.innerHTML = "";
  data.forEach(item => {
    const html = template(item);
    container.insertAdjacentHTML("beforeend", html);
  });
}

// ===================== PAGE NAVIGATION ===================== //
function showSection(id) {
  console.log("Switching to section:", id);
  const sections = document.querySelectorAll('.page-section');
  sections.forEach(section => section.classList.remove('active'));

  const selected = document.getElementById(id);
  if (selected) {
    selected.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });

  document.querySelectorAll('.page-section').forEach(section => {
    if (section.id !== id) {
      const inputs = section.querySelectorAll('.search-input');
      inputs.forEach(input => {
        if (input.id === "music-search") return;
        input.value = '';
        input.dispatchEvent(new Event('input', { bubbles: true }));
      });
    }
  });

    const fallback = document.getElementById('error-fallback');
    if (fallback) fallback.style.display = 'none';
  } else {
    showErrorFallback(`Section "${id}" not found.`);
  }

  const links = document.querySelectorAll('.navbar a');
  links.forEach(link => link.classList.remove('active'));
  const activeLink = Array.from(links).find(link => link.getAttribute('onclick')?.includes(id));
  if (activeLink) activeLink.classList.add('active');


  if (id === "home") {
    switchTab("tab-intro");
  }


  if (id === "arts") {
    currentArtCategory = "Show All";
    currentArtPage = 1;

    sortedArtsData = [...artsData].sort((a, b) => new Date(b.date) - new Date(a.date));
    filteredArtsData = [...sortedArtsData];  // Show All = full list

    renderArtsSection();

    document.querySelectorAll(".sidebar-btn").forEach(btn => {
      const text = btn.textContent.trim();
      btn.classList.toggle("active", text === "Show All");
    });

    document.getElementById("art-gallery").scrollTop = 0;
  }
  
  if (id === "characters") renderCharactersSection();

  if (id === "story") {
    resetLibrary();
  }

  if (id === "video") {
    currentVideoCategory = "Show All";
    currentVideoPage = 1;

    sortedVideosData = [...videosData].sort((a, b) => new Date(b.date) - new Date(a.date));
    filteredVideosData = [...sortedVideosData];

    renderVideoSidebar();
    renderVideosSection();

    document.querySelectorAll("#video-sidebar .sidebar-btn").forEach(btn => {
      const text = btn.textContent.trim();
      btn.classList.toggle("active", text === "Show All");
    });

    document.getElementById("video-gallery").scrollTop = 0;
  }

}


function switchTab(tabId) {
  const tabs = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.classList.remove('active');

    const inputs = tab.querySelectorAll('.search-input');
    inputs.forEach(input => {
      if (input.id === "music-search") return;
      input.value = '';
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
  });

  const selected = document.getElementById(tabId);
  if (selected) selected.classList.add('active');

  if (tabId === "tab-music") {
  const input = document.getElementById("music-search");
  if (input && input.value.trim() !== "") {
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }
}

  const buttons = document.querySelectorAll('.tab-menu button');
  buttons.forEach(btn => btn.classList.remove('active'));
  const activeButton = Array.from(buttons).find(btn =>
    btn.getAttribute('onclick')?.includes(tabId)
  );
  if (activeButton) activeButton.classList.add('active');

  if (tabId === "tab-music") {
  const musicContainer = document.querySelector(".music-section");

  const hasRendered = musicContainer && musicContainer.dataset.rendered === "true";
  if (!hasRendered) {
    renderDataSection({
      data: musicList,
      containerSelector: ".music-section",
      template: (m) => `
        <div class="music-card">
          <div class="music-info">
            <h3>${m.title}</h3>
            <p>${m.artist}</p>
            <img src="${m.cover}" class="music-cover" id="cover-${m.id}" style="display: none;" loading="lazy">
            <div class="now-playing">Now Playing...</div>
          </div>
          <audio id="audio-${m.id}" preload="none" data-src="${m.src}"></audio>
          <input type="range" value="0" class="seek-bar" id="seek-${m.id}">
          <div class="time-display" id="time-${m.id}">00:00 / 00:00</div>
          <div class="music-controls">
            <button onclick="seekBackward('audio-${m.id}')">⏮</button>
            <button onclick="togglePlay('audio-${m.id}', this)">▶</button>
            <button onclick="seekForward('audio-${m.id}')">⏭</button>
            <button onclick="restartAudio('audio-${m.id}')">⏹</button>
            <button class="repeat-toggle" onclick="toggleRepeat('audio-${m.id}', this)">🔁</button>
          </div>
          <div class="volume-controls">
            <button onclick="decreaseVolume('audio-${m.id}')">🔉</button>
            <input type="range" min="0" max="1" step="0.01" value="1"
                  class="volume-bar" data-audio-id="audio-${m.id}">
            <span class="volume-percent" id="volume-percent-${m.id}">100%</span>
            <button onclick="increaseVolume('audio-${m.id}')">🔊</button>
          </div>
          <div class="tempo-controls">
            <span class="tempo-icon">⏱</span>
            <input type="range" min="0.5" max="2" step="0.1" value="1"
                  class="tempo-bar" data-audio-id="audio-${m.id}">
            <span class="tempo-value" id="tempo-value-${m.id}">100%</span>
          </div>
          <div class="favorite-controls">
            <button class="favorite-btn" data-id="${m.id}" onclick="toggleFavorite('${m.id}', this)">
              ☆ FAVORITE
            </button>
          </div>
        </div>
      `
    });

    musicContainer.dataset.rendered = "true";

    filteredMusicList = [...musicList];
    musicList.forEach(m => setupAutoNext(`audio-${m.id}`));
    setupMusicListeners();
  }
}


  if (tabId === "tab-social") {
   renderDataSection({
    data: socialList,
    containerSelector: "#tab-social .social-row",
    template: (s) => `
      <div class="social-card ${s.style}">
        <div class="social-header">
          <div class="line short"></div>
          <div class="line long"></div>
        </div>
        <a href="${s.link}" target="_blank" class="social-icon-link">
          <img src="${s.img}" class="social-icon-img" alt="${s.platform}" loading="lazy">
        </a>
        <div class="social-text">
          <div class="platform">${s.platform}</div>
          <div class="username">${s.username}</div>
          <div class="status">${s.status}</div>
        </div>
      </div>
    `
  });
}

  if (tabId === "tab-blacklist") {
  renderDataSection({
    data: blacklistList,
    containerSelector: "#tab-blacklist .blacklist-list",
    template: (b) => `
      <div class="blacklist-item">
        <a href="${b.link}" target="_blank" class="blacklist-avatar">
          <img src="${b.avatar}" alt="${b.name}" loading="lazy">
        </a>
        <div class="blacklist-text">
          <div class="blacklist-name">${b.name}</div>
          <div class="blacklist-reason">${b.reason}</div>
        </div>
      </div>
    `
  });
}


  if (tabId === "tab-terms") {
    renderTerms();
  }



}

// ===================== CLOCK ===================== //

function updateClock() {
  const timeEl = document.getElementById("clock-time");
  const dateEl = document.getElementById("clock-date");

  const now = new Date();

  let hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12; // 12h format

  const padded = (n) => String(n).padStart(2, "0");
  timeEl.textContent = `${padded(hours)}:${padded(minutes)}:${padded(seconds)} ${ampm}`;

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const day = days[now.getDay()];
  const month = months[now.getMonth()];
  const date = now.getDate();

  dateEl.textContent = `${month}, ${day} ${date}`;
}

setInterval(updateClock, 1000);
updateClock(); // initial call


// ===================== ERROR HANDLING ===================== //
function showErrorFallback(message) {
  const fallback = document.getElementById('error-fallback');
  const msgBox = document.getElementById('error-message');
  if (!fallback || !msgBox) return;

  const sections = document.querySelectorAll('.page-section');
  sections.forEach(section => section.classList.remove('active'));

  fallback.style.display = 'block';
  msgBox.textContent = message;
}


// ===================== UTILS ===================== //
function highlight(text, keyword) {
  if (!keyword || keyword.trim() === "") return text; 
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text.replace(new RegExp(`(${escaped})`, 'gi'), '<mark>$1</mark>');
}

// ===================== INIT ===================== //
document.addEventListener("DOMContentLoaded", function () {
  renderFriendCarousel(); 
  showSection('home');
});


document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.querySelector('.navbar-toggle');
  const navbar = document.querySelector('.navbar');

  if (toggleBtn && navbar) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navbar.classList.toggle('open');
    });

    // Đóng khi click link
    navbar.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navbar.classList.remove('open');
      });
    });

    // Đóng khi click ra ngoài
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && e.target !== toggleBtn) {
        navbar.classList.remove('open');
      }
    });
  }
});


document.addEventListener('DOMContentLoaded', () => {
  const tabToggle = document.querySelector('.tab-toggle');
  const tabMenu = document.querySelector('.tab-menu');

  if (tabToggle && tabMenu) {
    tabToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      tabMenu.classList.toggle('open');
    });

    // đóng khi click 1 tab
    tabMenu.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        tabMenu.classList.remove('open');
      });
    });

    // đóng khi click ra ngoài
    document.addEventListener('click', (e) => {
      if (!tabMenu.contains(e.target) && e.target !== tabToggle) {
        tabMenu.classList.remove('open');
      }
    });
  }
});

function generateTrackingID() {
  const base = navigator.userAgent + screen.width + "x" + screen.height;

  let hash = 0;
  for (let i = 0; i < base.length; i++) {
    hash = (hash << 5) - hash + base.charCodeAt(i);
    hash |= 0;
  }

  return "NX-" + Math.abs(hash).toString(36).toUpperCase();
}

let trackingId = localStorage.getItem("trackingId");
if (!trackingId) {
  trackingId = generateTrackingID();
  localStorage.setItem("trackingId", trackingId);
}

if (window.console) {
  setInterval(() => {
    console.clear();
    console.warn(
      "%c⚠️ SECURITY WARNING ⚠️",
      "color: red; font-size: 40px; font-weight: bold; text-shadow: 2px 2px 10px black;"
    );
    console.warn(
      "%cThis project is an original creation by Neisy Alexrina.",
      "color: red; font-size: 22px; font-weight: bold;"
    );
    console.warn(
      "%cAll rights reserved © 2025 Neisy Alexrina.\nUnauthorized copying, reuse, or modification is strictly FORBIDDEN.",
      "color: red; font-size: 18px; font-weight: bold;"
    );
    console.warn(
      "%cViolation of copyright law may result in legal action.\nYou can be fined and summoned to court.",
      "color: black; background-color: red; font-size: 16px; font-weight: bold; padding: 4px;"
    );

    const now = new Date().toLocaleString();
    console.warn(
      `%c[Tracking Log] ID: ${trackingId} | Time: ${now} | Status: Logged`,
      "color: red; font-size: 14px;"
    );

    console.warn(
      "%cIf you are not the owner of this website, CLOSE this console immediately.",
      "color: red; font-size: 16px; font-weight: bold;"
    );
  }, 3000);
}

let violationCount = 0;

function showBigWarning() {
  violationCount++;

  let overlay = document.getElementById("screen-warning");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "screen-warning";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "rgba(200,0,0,0.95)";
    overlay.style.color = "white";
    overlay.style.display = "flex";
    overlay.style.flexDirection = "column";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.zIndex = "999999";
    overlay.style.fontSize = "2rem";
    overlay.style.fontWeight = "bold";
    overlay.style.textAlign = "center";
    document.body.appendChild(overlay);
  }

  overlay.innerHTML = `
    ⚠️ SECURITY ALERT ⚠️<br><br>
    This project is owned by <span style="color:yellow">Neisy Alexrina</span>.<br>
    Unauthorized actions are forbidden.<br>
    <span style="color:orange">Your activity is being tracked!</span><br><br>
    🚫 Violation count: <span style="color:#0ff">${violationCount}</span>
  `;

  clearTimeout(overlay._timeout);
  overlay._timeout = setTimeout(() => {
    overlay.remove();
  }, 10000);
}

document.addEventListener("contextmenu", e => e.preventDefault());

document.addEventListener("keydown", e => {
  const key = e.key.toLowerCase();

  if (e.key === "F12" ||
      (e.ctrlKey && ["u","s","p"].includes(key)) ||
      (e.ctrlKey && e.shiftKey && ["i","j","c","k","e","q","m","s"].includes(key))) {
    e.preventDefault();
    showBigWarning();
  }
});

function toggleWatermark() {
  const wm = document.getElementById("copyright-watermark");
  if (!wm) return;

  if (wm.style.opacity === "0") {
    wm.style.opacity = "0.5";  
    wm.style.zIndex = "99999"; 
  } else {
    wm.style.opacity = "0";
    wm.style.zIndex = "-9999";
  }
}

document.addEventListener("keydown", e => {
  if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "w") {
    toggleWatermark();
  }
});


