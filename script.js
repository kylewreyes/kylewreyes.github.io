let isMobile;

window.addEventListener("DOMContentLoaded", function () {
  const navBar = document.getElementById("navbar");
  const navBarLinks = document.getElementsByClassName("navbar-link");
  const navBarButton = document.getElementById("navbar-button");
  const sections = document.getElementsByTagName("section");
  const arrowLink = document.getElementById("arrow-box");

  /**
   * Checks if a given screen will be using the mobile or desktop navbar
   */
  function checkMobileOrDesktop() {
    isMobile =
      document.documentElement.clientWidth <= 800 ||
      document.documentElement.clientHeight <= 450;
  }

  /**
   * Calculates the custom --vh CSS variable, which is used to calculate the
   * correct viewport on mobile
   */
  function calculateMobileHt() {
    // document.documentElement.clientHeight is more reliable than
    // window.innerHeight when it comes to mobile browsers
    document
      .querySelector(":root")
      .style.setProperty(
        "--vh",
        document.documentElement.clientHeight / 100 + "px"
      );
  }

  /** When resizing, need to ensure that the navbar switches appropriately
   * (through the media queries), but that requires removing the styling from
   * the JS, which takes higher precedence.
   **/
  function showNavBar() {
    const curr_style = window
      .getComputedStyle(navBar)
      .getPropertyValue("display");
    if (curr_style === "none" && !isMobile) {
      navBar.style.display = null;
    }
  }

  /**
   * Switches the mobile navbar from being visible or not
   */
  function toggleNavBar() {
    if (navBar.classList.contains("open-navbar")) {
      navBar.classList.remove("open-navbar");
      // Before removing the element from the document flow, we need to let the
      // transition finish (500 ms) first
      window.setTimeout(() => {
        navBar.style.display = "none";
      }, 500);
    } else {
      navBar.style.display = "block";
      // For the transition to appear, the element needs to be in the document
      // flow. So, we change the display first and then let the transition
      // happen
      window.setTimeout(() => {
        navBar.classList.add("open-navbar");
      }, 1);
    }
  }

  /**
   * Hides the navbar after clicking one of its elements. Used for mobile
   */
  function hideNavBar() {
    navBar.style.display = "none";
    navBar.classList.remove("open-navbar");
  }

  /**
   * Adds and removes the event listeners on each navbar link that calls
   * hideNavBar()
   */
  function updateNavBarListeners() {
    if (isMobile) {
      for (let link of navBarLinks) {
        link.addEventListener("click", hideNavBar);
      }
    } else {
      for (let link of navBarLinks) {
        link.removeEventListener("click", hideNavBar);
      }
    }
  }

  calculateMobileHt();
  checkMobileOrDesktop();
  updateNavBarListeners();
  window.addEventListener("resize", calculateMobileHt);
  window.addEventListener("resize", checkMobileOrDesktop);
  window.addEventListener("resize", showNavBar);
  window.addEventListener("resize", updateNavBarListeners);
  navBarButton.addEventListener("click", toggleNavBar);

  // Handle smooth scrolling for iOS
  arrowLink.addEventListener("click", () => {
    sections[1].scrollIntoView({ behavior: "smooth" });
  });
  for (let i = 0; i < navBarLinks.length; i++) {
    navBarLinks[i].addEventListener("click", () => {
      sections[i].scrollIntoView({ behavior: "smooth" });
    });
  }
});

// Need to calculate offsets only after page is loaded because images will be
// fully rendered
window.addEventListener("load", () => {
  const navBar = document.getElementById("navbar");
  const navBarLinks = document.getElementsByClassName("navbar-link");
  let sectionOffsets = [];

  /**
   * Calculates the respective y positions of each section, which is used to
   * highlight the current section on the navbar
   */
  function calcSectionOffets() {
    const MOBILE_NAVBAR_HT = 50;
    sectionOffsets = [];
    for (let section of document.getElementsByTagName("section")) {
      let val = Math.floor(
        window.pageYOffset + section.getBoundingClientRect().top
      );
      sectionOffsets.push(val);
    }

    if (isMobile) {
      for (i = 1; i < sectionOffsets.length; ++i) {
        sectionOffsets[i] = sectionOffsets[i] - MOBILE_NAVBAR_HT;
      }
    }
    console.log("before", sectionOffsets);
    // Sometimes, the first offset is -1, not sure why
    sectionOffsets[0] = 0;
    for (i = 1; i < sectionOffsets.length; ++i) {
      // Anchor tags can be a little off, so we include a margin
      if (sectionOffsets[i] >= 1) {
        sectionOffsets[i] -= 1;
      }
    }
  }

  /**
   * Modifies the navbar from absolute to fixed position and vice versa. Also
   * changes which navbar item is highlighted
   */
  function updateNavBar() {
    // Changes from absolute to fixed position for desktop
    if (isMobile) {
      if (window.pageYOffset >= document.documentElement.clientHeight) {
        navBar.classList.add("sticky");
      } else {
        navBar.classList.remove("sticky");
      }
    } else {
      const arrowDownPos = document.getElementById("arrow-box").offsetTop;
      if (window.pageYOffset >= arrowDownPos) {
        navBar.classList.add("sticky");
      } else {
        navBar.classList.remove("sticky");
      }
    }

    // Updates active section of the navbar
    for (link of navBarLinks) {
      link.classList.remove("active-navbar-link");
    }
    let i = 1;
    for (; i < sectionOffsets.length; ++i) {
      if (window.pageYOffset < sectionOffsets[i]) {
        break;
      }
    }
    navBarLinks[i - 1].classList.add("active-navbar-link");
  }

  calcSectionOffets();
  updateNavBar();
  window.addEventListener("scroll", updateNavBar);
  // When the viewport is resized, need to recalculate the values at which the
  // active section becomes highlighted
  window.addEventListener("resize", calcSectionOffets);
  window.addEventListener("resize", updateNavBar);
});
