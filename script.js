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
  document.getElementById('overlay').style.display = 'none';
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

/* Navegación entre secciones con animación lateral */
let currentPage = "home";

// Orden de las páginas
const pageOrder = ["home", "commissions", "gallery", "contact"];

function navigateTo(target) {
  if (target === currentPage) return;

  const current = document.getElementById(currentPage);
  const next = document.getElementById(target);

  const idxCurrent = pageOrder.indexOf(currentPage);
  const idxNext = pageOrder.indexOf(target);
  const direction = idxNext > idxCurrent ? 'right' : 'left';

  next.classList.add('active');
  next.style.left = direction === 'right' ? '100%' : '-100%';
  requestAnimationFrame(() => {
    current.style.left = direction === 'right' ? '-100%' : '100%';
    current.style.opacity = 0;
    next.style.left = '0';
    next.style.opacity = 1;
  });

  setTimeout(() => {
    current.classList.remove('active');
    current.style.left = direction === 'right' ? '-100%' : '100%';
    currentPage = target;
  }, 600);
}
