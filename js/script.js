/////////// SLICK SLIDE for Slideshow Section ///////////
$('.slideshow').slick({
  centerMode: true,
  centerPadding: '60px',
  slidesToShow: 5,
  focusOnSelect: true,
  responsive: [
    {
      breakpoint: 960,
      settings: {
        arrows: true,
        centerMode: true,
        centerPadding: '40px',
        slidesToShow: 3
      }
    },
    {
      breakpoint: 780,
      settings: {
        arrows: false,
        centerMode: true,
        centerPadding: '20px',
        slidesToShow: 3
      }
    },
    {
      breakpoint: 550,
      settings: {
        arrows: false,
        centerMode: true,
        centerPadding: '40px',
        slidesToShow: 1
      }
    }
  ]
});

/////////// Make Header shows when scroll up, hides when scroll down ///////////
const header = document.querySelector(".header");
const secondNav = document.querySelector(".nav-secondary");

let prevScrollPos = window.scrollY;

const showUpHeader = function () {
  let currScrollPos = window.scrollY;

  // Scroll down
  if (currScrollPos > prevScrollPos) {
    header.classList.add("js-header--hidden");
    secondNav.classList.add("js-nav-secondary--top");
  }
  // Scroll up
  if (currScrollPos < prevScrollPos) {
    header.classList.remove("js-header--hidden");
    secondNav.classList.remove("js-nav-secondary--top");
  }

  prevScrollPos = currScrollPos
}

/////////// SMOOTH SCROLL in Secondary Navigation ///////////
const secondNavList = document.querySelector(".nav-secondary__list");

// Scroll to specific section
const scrollToSection = function (section) {
  const sectionCoords = section.getBoundingClientRect();
  const secondNavHeight = secondNav.offsetHeight; //because secondNav is sticky now -> minus its height when scroll

  window.scrollTo({
    left: sectionCoords.left + window.scrollX,
    top: sectionCoords.top + window.scrollY - secondNavHeight,
    behavior: "smooth",
  });
}
secondNavList.addEventListener("click", function (e) {
  e.preventDefault();

  const link = e.target;
  if (!link.classList.contains("nav-secondary__link")) return;

  const idSection = link.getAttribute("href");
  const section = document.querySelector(idSection);

  // section.scrollIntoView({ behavior: "smooth" })
  scrollToSection(section);

  // Close nav secondary in mobile
  document.querySelector(".nav-secondary__btn-toggle").classList.remove("open")

})

/////////// Line Second Nav's Link when scroll to corresponding section ///////////
const allSectionLine = document.querySelectorAll(".js-section-to-line");
const allSecondNavLink = document.querySelectorAll(".nav-secondary__link");

const lineSecondNavLink = function () {
  let currSectionId;
  allSectionLine.forEach(section => {
    const sectionTop = section.offsetTop;
    if (window.scrollY >= sectionTop - secondNav.offsetHeight - 1)
      currSectionId = section.getAttribute("id");
  })

  if (!currSectionId) return;

  allSecondNavLink.forEach(link => {
    link.classList.remove("nav-secondary__link--active");
    if (link.getAttribute("href") === `#${currSectionId}`)
      link.classList.add("nav-secondary__link--active");
  })
}

/////////// Shop button in Introduction section ///////////
const btnCtaIntro = document.querySelector(".introduction__cta-btn");
const shopSection = document.querySelector(".shop");

btnCtaIntro.onclick = function () {
  scrollToSection(shopSection);
}
/////////// Tabbed Platform ///////////
const platformsList = document.querySelector(".platform-operations-container");
const allPlatformBtn = document.querySelectorAll(".platform-operation");
const allCardsContainer = document.querySelectorAll(".shop__content");

// Change Cards to corresponding platform 
const tabToCards = function (platform) {
  allPlatformBtn.forEach(btn =>
    btn.classList.remove("platform--active")
  );
  platform.classList.add("platform--active");

  allCardsContainer.forEach(container =>
    container.classList.remove("js-cards--active")
  );


  const cardContainer = document.querySelector(`.cards--${platform.dataset.platform}`);
  cardContainer.classList.add("js-cards--active");
  cardContainer.classList.add("js-loading");

  // Bad code :<
  platformsList.classList.add("js-loading");
  setTimeout(() => {
    platformsList.classList.remove("js-loading");
  }, 1000)
};

platformsList.addEventListener('click', function (e) {
  const platform = e.target.closest(".platform-operation");

  if (!platform) return;
  tabToCards(platform);
});

/////////// Platform in Introduction ///////////
const introPlatformsList = document.querySelector(".introduction__platforms-list");
const shopSubHeading = document.querySelector(".shop__sub-heading");

introPlatformsList.addEventListener('click', function (e) {
  e.preventDefault();
  const platform = e.target.closest(".introduction__platform-operation");

  if (!platform) return;
  scrollToSection(shopSubHeading);

  setTimeout(() => {
    const target = document.querySelector(platform.getAttribute("href"));
    tabToCards(target);

  }, 1000);
})

/////////// Toggle item in Card ///////////
const btnToggleList = document.querySelectorAll('.js-toggle');
btnToggleList.forEach(btn => {
  btn.onclick = () => {
    btn.classList.toggle("open");
  }
})

/////////// Reveal Section ///////////
const allRevealSection = document.querySelectorAll(".js-reveal-section");
const revealSection = function (entries, observer) {
  const [entry] = entries;
  // if (!entry.isIntersecting) return;
  if (!entry.isIntersecting) {
    entry.target.classList.add("section--hidden");
  }
  if (entry.isIntersecting) {
    entry.target.classList.remove("section--hidden");
  }
  // observer.unobserve(entry.target);
}
const revealObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0,
});
allRevealSection.forEach(section => {
  revealObserver.observe(section);
  // section.classList.add("section--hidden");
});
/////////// Lazy image ///////////
const lazyImgs = document.querySelectorAll("img[data-src]");

const lazyLoading = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  const img = entry.target;
  img.src = img.dataset.src;
  img.addEventListener("load", function () {
    img.classList.remove("js-lazy-img");
  });
  observer.unobserve(img);

}
const lazyObserver = new IntersectionObserver(lazyLoading, {
  root: null,
  threshold: 0,
  rootMargin: "-200px"
});

lazyImgs.forEach(img => {
  lazyObserver.observe(img);
})
/////////// Set year in footer's copyright ///////////
const yearLabel = document.querySelector(".footer__year");
const now = new Date();
yearLabel.textContent = now.getFullYear();

// ####When window scroll
window.onscroll = function () {
  showUpHeader();

  lineSecondNavLink();
}


/////////// Main (Header) Nav toggle button in mobile ///////////
const navCheckBox = document.querySelector(".header__nav-checkbox");
const navBtn = document.querySelector(".header__nav-button");
const mainNav = document.querySelector(".header__nav");
const searchBtn = document.querySelector(".header__search-button-toggle");


navBtn.addEventListener('click', () => {
  if (navCheckBox.checked) {
    mainNav.classList.remove("open");
    searchBtn.classList.remove("js-hidden");
  } else {
    mainNav.classList.add("open");
    searchBtn.classList.add("js-hidden");
  }
});

// SYSTEM
const allSystemDetails = document.querySelectorAll(".system__details");
const btnMinimum = document.querySelector(".system__tab--mn");
const btnRecommend = document.querySelector(".system__tab--rcm");


const goToDetailts = function (curTab) {
  allSystemDetails.forEach(
    (elm, i) => (elm.style.transform = `translateX(${100 * (i - curTab)}%)`)
  );
}
const init = () => {
  goToDetailts(0);
}
const destruct = () => {
  allSystemDetails.forEach(
    (elm, _) => (elm.style.transform = `translateX(0%)`)
  );
}
const handleSystemTabs = () => {
  if (window.innerWidth < 780) {
    init();
    btnMinimum.onclick = () => {
      goToDetailts(0);
      btnMinimum.classList.toggle("system__tab--active");
      btnRecommend.classList.toggle("system__tab--active");
    }
    btnRecommend.onclick = () => {
      goToDetailts(1);
      btnMinimum.classList.toggle("system__tab--active");
      btnRecommend.classList.toggle("system__tab--active");
    }
  } else {
    destruct();
  }
}
window.addEventListener("resize", handleSystemTabs);
window.addEventListener("load", handleSystemTabs);