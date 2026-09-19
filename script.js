// ===== Nomor WhatsApp utama =====
const WA_NUMBER = "6287810963528";

// ===== Google Ads Conversion Tracking =====
function trackConversion() {
  if (typeof gtag === "function") {
    gtag('event', 'conversion_event_contact_1', {});
  }
}

// Conversion action kedua (contact_2) - dipasang biar semua klik link WA
// ikut ke-track di kedua conversion action Google Ads.
function trackConversion2() {
  if (typeof gtag === "function") {
    gtag('event', 'conversion_event_contact_2', {});
  }
}

// Conversion action ketiga (contact_3) - sama seperti contact_1 & contact_2,
// semua link WA di-tracking ke event ini juga.
function trackConversion3() {
  if (typeof gtag === "function") {
    gtag('event', 'conversion_event_contact_3', {});
  }
}

// Conversion action keempat (contact_4) - sama seperti contact_1 sampai contact_3,
// semua link WA di-tracking ke event ini juga.
function trackConversion4() {
  if (typeof gtag === "function") {
    gtag('event', 'conversion_event_contact_4', {});
  }
}

// Panggil keempat tracker sekaligus - dipakai di semua titik klik ke WA.
function trackAllConversions() {
  trackConversion();
  trackConversion2();
  trackConversion3();
  trackConversion4();
}

// ===== Menu mobile =====
const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");
if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
  mobileMenu.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// ===== Carousel =====
const carouselTrack = document.getElementById("carouselTrack");
const carDots = document.getElementById("carDots");
let currentSlide = 0;

function setupCarousel() {
  if (!carouselTrack) return;
  const slides = carouselTrack.children.length;
  carDots.innerHTML = "";
  for (let i = 0; i < slides; i++) {
    const dot = document.createElement("button");
    dot.className = "dot-btn" + (i === 0 ? " active" : "");
    dot.setAttribute("aria-label", "Slide " + (i + 1));
    dot.addEventListener("click", () => goToSlide(i));
    carDots.appendChild(dot);
  }
}

function goToSlide(index) {
  const slides = carouselTrack.children.length;
  currentSlide = (index + slides) % slides;
  carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
  [...carDots.children].forEach((dot, i) => dot.classList.toggle("active", i === currentSlide));
}

function moveSlide(direction) {
  goToSlide(currentSlide + direction);
}

setupCarousel();

// Autoplay ringan, berhenti kalau user hover
let autoplay = setInterval(() => moveSlide(1), 6000);
if (carouselTrack) {
  carouselTrack.addEventListener("mouseenter", () => clearInterval(autoplay));
  carouselTrack.addEventListener("mouseleave", () => { autoplay = setInterval(() => moveSlide(1), 6000); });
}

// ===== Lazy load video (baru dimuat saat scroll mendekat, bukan saat page load) =====
const lazyVideos = document.querySelectorAll("video.lazy-video");
if (lazyVideos.length) {
  if ("IntersectionObserver" in window) {
    const videoObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const video = entry.target;
        video.querySelectorAll("source[data-src]").forEach(source => {
          source.src = source.dataset.src;
          source.removeAttribute("data-src");
        });
        video.load();
        observer.unobserve(video);
      });
    }, { rootMargin: "200px 0px" });
    lazyVideos.forEach(video => videoObserver.observe(video));
  } else {
    // Fallback untuk browser lama tanpa IntersectionObserver
    lazyVideos.forEach(video => {
      video.querySelectorAll("source[data-src]").forEach(source => {
        source.src = source.dataset.src;
        source.removeAttribute("data-src");
      });
      video.load();
    });
  }
}

// ===== FAQ accordion =====
document.querySelectorAll(".faq-item").forEach(item => {
  const btn = item.querySelector(".faq-q");
  btn.addEventListener("click", () => {
    const wasOpen = item.classList.contains("open");
    document.querySelectorAll(".faq-item.open").forEach(el => el.classList.remove("open"));
    if (!wasOpen) item.classList.add("open");
  });
});

// ===== Order via WhatsApp (dari tombol paket) =====
function orderWA(paket, harga) {
  trackAllConversions();
  const pesan = `Halo, saya mau order paket internet XL SATU.\nPaket: ${paket}\nHarga: ${harga}`;
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(pesan)}`, "_blank");
}

// ===== Cek Area =====
function cekAreaWA() {
  const nama = document.getElementById("cekNama").value.trim();
  const alamat = document.getElementById("cekAlamat").value.trim();
  const hp = document.getElementById("cekHP").value.trim();
  if (!nama || !alamat || !hp) {
    alert("Mohon lengkapi semua data dulu.");
    return;
  }
  trackAllConversions();
  const pesan = `Halo, saya mau cek coverage XL SATU.\nNama: ${nama}\nAlamat: ${alamat}\nNo HP: ${hp}`;
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(pesan)}`, "_blank");
}

// ===== Registrasi =====
function registrasiWA() {
  const nama = document.getElementById("regNama").value.trim();
  const hp = document.getElementById("regHP").value.trim();
  const alamat = document.getElementById("regAlamat").value.trim();
  const paketEl = document.getElementById("regPaket");
  const paket = paketEl ? paketEl.value : "";
  if (!nama || !hp || !alamat) {
    alert("Mohon lengkapi semua data dulu.");
    return;
  }
  trackAllConversions();
  const pesan = `Halo, saya mau daftar XL SATU.\nNama: ${nama}\nNo HP: ${hp}\nAlamat: ${alamat}\nPaket diminati: ${paket || "belum ditentukan"}`;
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(pesan)}`, "_blank");
}

// ===== Track semua link WhatsApp statis =====
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(`a[href*="wa.me"]`).forEach(link => {
    link.addEventListener("click", () => trackAllConversions());
  });
});
