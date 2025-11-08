function copyDiscord() {
  const discordUser = "raccoonguy09";
  navigator.clipboard.writeText(discordUser).then(() => {

    const popup = document.getElementById("discordCopyMsg");
    popup.classList.add("show");

    setTimeout(() => {
      popup.classList.remove("show");
    }, 2000);
  });
}

const commissions = {
  emotes: {
    title: "Emotes",
    description: "Placeholder",
    price: "$3.5 – $6.5",
    images: ["Images/HypnoTaerie_squeesh.png", "Images/Pix_blep.png", "Images/Taerie_big_eyes_emote.png"]
  },
  doodles: {
    title: "Doodles",
    description: "Placeholder.",
    price: "$5 – $15",
    images: ["Images/Doodle1.png", "Images/Doodle2.png", "Images/Doodle3.png"]
  },
  painting: {
    title: "Digital Painting",
    description: "Placeholder.",
    price: "$100 – $200",
    images: []
  }
};

let currentType = null;
let currentIndex = 0;

function showCommission(type) {
  currentType = type;
  currentIndex = 0;
  const content = document.getElementById('content');
  const com = commissions[type];
  content.innerHTML = `
    <button id="closeBtn" onclick="closeOverlay()">✕</button>
    <h2>${com.title}</h2>
    <p>${com.description}</p>
    <p class="price">${com.price}</p>
    <div id="gallery-view">
      <button onclick="prevImage()">⟨</button>
      <img id="gallery-image" src="${com.images[0] || ''}" alt="Commission Example">
      <button onclick="nextImage()">⟩</button>
    </div>
  `;
  document.getElementById('overlay').style.display = 'flex';
}

function closeOverlay() {
  const overlay = document.getElementById('overlay');
  overlay.style.transition = 'all 0.6s ease-in-out';
  overlay.style.opacity = '1';
  overlay.style.transform = 'translateY(0)';
  overlay.style.opacity = '0';
  overlay.style.transform = 'translateY(30px)';
  setTimeout(() => {
    overlay.style.display = 'none';
    overlay.style.transition = '';
    overlay.style.opacity = '';
    overlay.style.transform = '';
  }, 600);
}

function showImage() {
  if (!currentType) return;
  const img = document.getElementById('gallery-image');
  img.src = commissions[currentType].images[currentIndex];
}

function prevImage() {
  if (!currentType) return;
  const imgs = commissions[currentType].images;
  if (imgs.length === 0) return;
  currentIndex = (currentIndex - 1 + imgs.length) % imgs.length;
  showImage();
}

function nextImage() {
  if (!currentType) return;
  const imgs = commissions[currentType].images;
  if (imgs.length === 0) return;
  currentIndex = (currentIndex + 1) % imgs.length;
  showImage();
}

function setGifCornerByPage(page) {
  const body = document.body;
  const gifWrapper = document.getElementById("corner-gif-wrapper");
  const all = ["home-gif", "commissions-gif", "gallery-gif", "contact-gif"];
  body.classList.remove(...all);
  body.classList.add(`${page}-gif`);
  if (gifWrapper) {
    gifWrapper.classList.remove("moving");
    void gifWrapper.offsetWidth;
    gifWrapper.classList.add("moving");
  }
}

const pageOrder = ["home", "commissions", "gallery", "contact"];
let currentPage = "home";
let isTransitioning = false;

function navigateTo(target) {
  if (target === currentPage || isTransitioning) return;
  isTransitioning = true;

  const current = document.getElementById(currentPage);
  const next = document.getElementById(target);
  const idxCurrent = pageOrder.indexOf(currentPage);
  const idxNext = pageOrder.indexOf(target);
  const direction = idxNext > idxCurrent ? "right" : "left";

  next.classList.add("active");
  next.style.transition = "none";
  next.style.opacity = "0";
  next.style.left = direction === "right" ? "100%" : "-100%";
  next.style.zIndex = "5";
  current.style.zIndex = "4";
  void next.offsetWidth;
  next.style.transition = current.style.transition = "all 0.6s ease-in-out";
  current.style.left = direction === "right" ? "-100%" : "100%";
  current.style.opacity = "0";
  next.style.left = "0";
  next.style.opacity = "1";

  setGifCornerByPage(target);

  setTimeout(() => {
    current.classList.remove("active");
    current.style.transition = next.style.transition = "";
    current.style.left = current.style.opacity = current.style.zIndex = "";
    next.style.zIndex = "";
    currentPage = target;
    isTransitioning = false;
  }, 650);
}

function RandomPostRaco() {
  Posts
}

document.addEventListener("DOMContentLoaded", () => {
  setGifCornerByPage("home");
});



let blueskyCursor = null;
let blueskyLoading = false;
const blueskyUser = "racoguy.bsky.social";
const blueskyList = document.getElementById("post-list");
const blueskyBtn = document.getElementById("loadMoreBtn");

async function loadBlueskyPosts() {
  if (blueskyLoading) {
    console.log("Already loading, ignoring new request.");
    return;
  }
  blueskyLoading = true;
  blueskyBtn.textContent = "Loading...";

  try {
    const url = new URL("https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed");
    url.searchParams.set("actor", blueskyUser);
    url.searchParams.set("limit", "10");
    if (blueskyCursor) url.searchParams.set("cursor", blueskyCursor);

    console.log("Fetching:", url.toString());

    const res = await fetch(url);
    console.log("Response status:", res.status);

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status}: ${text}`);
    }

    const data = await res.json();
    console.log("Fetched data:", data);

    blueskyCursor = data.cursor || null;
    console.log("Next cursor:", blueskyCursor);

    if (!Array.isArray(data.feed)) {
      console.error("Feed missing or not an array:", data);
      return;
    }


    const postsWithImages = data.feed.filter(p => {
      const embed = p.post.record?.embed;
      const hasImages = embed?.images && embed.images.length > 0;
      if (!hasImages) console.log("Skipping post (no images):", p.post.uri);
      return hasImages;
    });

    console.log(`Found ${postsWithImages.length} posts with images.`);

    if (postsWithImages.length === 0) {
      blueskyList.insertAdjacentHTML(
        "beforeend",
        `<p style="text-align:center;color:#aaa;">No posts with images found.</p>`
      );
      blueskyBtn.textContent = "Load More";
      blueskyLoading = false;
      return;
    }

    postsWithImages.forEach(p => {
      const record = p.post.record;
      const author = p.post.author;
      const uri = p.post.uri;
      const cid = p.post.cid;

      const blockquote = document.createElement("blockquote");
      blockquote.className = "bluesky-embed";
      blockquote.dataset.blueskyUri = uri;
      blockquote.dataset.blueskyCid = cid;
      blockquote.dataset.blueskyEmbedColorMode = "system";
      blockquote.innerHTML = `
        <p lang="en">
          ${record.text?.replace(/\n/g, "<br><br>") ?? ""}
          <br><br>
          <a href="https://bsky.app/profile/${author.did}/post/${uri.split("/").pop()}?ref_src=embed">[image or embed]</a>
        </p>
        &mdash; ${author.displayName || author.handle}
        (<a href="https://bsky.app/profile/${author.did}?ref_src=embed">@${author.handle}</a>)
        <a href="https://bsky.app/profile/${author.did}/post/${uri.split("/").pop()}?ref_src=embed">${new Date(record.createdAt).toLocaleString()}</a>
      `;
      blueskyList.appendChild(blockquote);
    });


    if (window.BlueskyEmbed && typeof window.BlueskyEmbed.processEmbeds === 'function') {
      window.BlueskyEmbed.processEmbeds();
    } else {

      const existing = document.querySelector('script[src*="embed.bsky.app/static/embed.js"]');
      if (existing) {
        const newScript = document.createElement('script');
        newScript.async = true;
        newScript.src = existing.src;
        newScript.charset = 'utf-8';
        document.body.appendChild(newScript);
      }
    }


    if (!blueskyCursor) {
      console.log("No more posts available (no cursor returned).");
      blueskyBtn.style.display = "none";
    }
  } catch (err) {
    console.error("Bluesky error:", err);
  } finally {
    blueskyBtn.textContent = "Load More";
    blueskyLoading = false;
  }
}

// initialize
if (blueskyBtn && blueskyList) {
  blueskyBtn.addEventListener("click", loadBlueskyPosts);
  document.addEventListener("DOMContentLoaded", loadBlueskyPosts);
} else {
  console.error("Missing #post-list or #loadMoreBtn elements in DOM.");
}
