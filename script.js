// TODO: desktop navbar disappears on hard refresh

const MOBILE_NAVBAR_LIMIT = 800;

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

window.addEventListener("DOMContentLoaded", function () {
  calculateMobileHt();
  window.addEventListener("resize", calculateMobileHt);
});

/**
 * Need to ensure that all the elements are fully loaded before calculating the
 * offsets.
 */
window.addEventListener("load", function () {
  const navBar = document.getElementById("navbar");
  const navBarLinks = document.getElementsByClassName("navbar-link");

  window.addEventListener("scroll", updateNavBar);
  // When the viewport is resized, need to recalculate the values at which the
  // active section becomes highlighted
  window.addEventListener("resize", calcSectionOffets);
  window.addEventListener("resize", updateNavBar);
  // When resizing, need to ensure that the navbar switches appropriately
  // (through the media queries), but that requires removing the styling from
  // the JS, which takes higher precedence
  window.addEventListener("resize", function () {
    navBar.style.display = null;
  });

  let sectionOffsets = [];

  function calcSectionOffets() {
    sectionOffsets = [];
    for (let section of document.getElementsByTagName("section")) {
      const val =
        window.pageYOffset + Math.floor(section.getBoundingClientRect().top);
      sectionOffsets.push(val);
    }

    const MOBILE_NAVBAR_HT = 50;
    if (window.innerWidth <= MOBILE_NAVBAR_LIMIT) {
      for (i = 1; i < sectionOffsets.length; ++i) {
        sectionOffsets[i] = sectionOffsets[i] - MOBILE_NAVBAR_HT;
      }
    }
  }

  calcSectionOffets();
  console.log(sectionOffsets);
  updateNavBar();

  const navBarButton = document.getElementById("navbar-button");
  navBarButton.addEventListener("click", toggleNavBar);

  /**
   * Modifies the navbar from absolute to fixed position and vice versa. Also
   * changes which navbar item is highlighted
   */
  function updateNavBar() {
    // Changes from absolute to fixed position for desktop
    if (window.innerWidth <= MOBILE_NAVBAR_LIMIT) {
      const arrowDownPos = document.getElementById("navbar-header").offsetTop;
      if (window.pageYOffset >= arrowDownPos) {
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
