/**
 * Need to do this before accessing any DOM elements, as it waits for the initial
 * HTML document to load (but not waiting for any stylesheets, images, and
 * subframes to finish loading)
 */
document.addEventListener("DOMContentLoaded", function () {
  window.addEventListener("scroll", updateNavBar);
  // When the viewport is resized, need to recalculate the values at which the
  // active section becomes highlighted
  window.addEventListener("resize", calcSectionOffets);

  const navBar = document.getElementById("navbar");
  const navBarLinks = document.getElementsByClassName("navbar-link");
  let sectionOffsets = [];

  function calcSectionOffets() {
    sectionOffsets = [];
    for (let section of document.getElementsByTagName("section")) {
      sectionOffsets.push(section.offsetTop);
    }

    const MOBILE_NAVBAR_LIMIT = 800;
    const MOBILE_NAVBAR_HT = 50;
    if (window.innerWidth <= MOBILE_NAVBAR_LIMIT) {
      for (i = 1; i < sectionOffsets.length; ++i) {
        sectionOffsets[i] = sectionOffsets[i] - MOBILE_NAVBAR_HT;
      }
    }
  }

  calcSectionOffets();

  const navBarButton = document.getElementById("navbar-button");
  navBarButton.addEventListener("click", toggleNavBar);

  /**
   * Modifies the navbar from absolute to fixed position and vice versa. Also
   * changes which navbar item is highlighted
   */
  function updateNavBar() {
    // Changes from absolute to fixed position for desktop
    const arrowDownPos = document.getElementById("arrow-box").offsetTop;
    if (window.pageYOffset >= arrowDownPos) {
      navBar.classList.add("sticky");
    } else {
      navBar.classList.remove("sticky");
    }

    for (link of navBarLinks) {
      link.classList.remove("active-navbar-link");
    }

    // Updates active section of the navbar
    let i = 1;
    for (; i < sectionOffsets.length; ++i) {
      if (window.pageYOffset < sectionOffsets[i]) {
        break;
      }
    }
    navBarLinks[i - 1].classList.add("active-navbar-link");
  }

  function toggleNavBar() {
    toggled = window.getComputedStyle(navBar).getPropertyValue("display");
    if (toggled === "none") {
      navBar.style.display = "block";
    } else {
      navBar.style.display = "none";
    }
  }
});
