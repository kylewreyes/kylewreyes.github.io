let isMobile;

window.addEventListener("DOMContentLoaded", function () {
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

  calculateMobileHt();
  checkMobileOrDesktop();
  window.addEventListener("resize", calculateMobileHt);
  window.addEventListener("resize", checkMobileOrDesktop);
});

/*
 * Need to ensure that all the elements are fully loaded before calculating the
 * offsets.
 */
window.addEventListener("load", function () {
  const MOBILE_NAVBAR_HT = 50;
  const navBar = document.getElementById("navbar");
  const navBarLinks = document.getElementsByClassName("navbar-link");
  const navBarButton = document.getElementById("navbar-button");
  let sectionOffsets = [];

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

  /**
   * Calculates the respective y positions of each section, which is used to
   * highlight the current section on the navbar
   */
  function calcSectionOffets() {
    sectionOffsets = [];
    for (let section of document.getElementsByTagName("section")) {
      let val =
        window.pageYOffset + Math.floor(section.getBoundingClientRect().top);
      // Anchor tags can be a little off, so we include a margin
      if (val >= 1) {
        val -= 1;
      }
      sectionOffsets.push(val);
    }

    if (isMobile) {
      for (i = 1; i < sectionOffsets.length; ++i) {
        sectionOffsets[i] = sectionOffsets[i] - MOBILE_NAVBAR_HT;
      }
    }
    console.log("Section Offsets: ", sectionOffsets);
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
    const toggled = window.getComputedStyle(navBar).getPropertyValue("display");
    if (toggled === "none") {
      navBar.style.display = "block";
    } else {
      navBar.style.display = "none";
    }
  }

  // Closes the mobile navbar after clicking one of the items
  if (isMobile) {
    for (let link of navBarLinks) {
      link.addEventListener("click", () => {
        navBar.style.display = "none";
      });
    }
  }

  calcSectionOffets();
  updateNavBar();
  window.addEventListener("scroll", updateNavBar);
  // When the viewport is resized, need to recalculate the values at which the
  // active section becomes highlighted
  window.addEventListener("resize", calcSectionOffets);
  window.addEventListener("resize", updateNavBar);
  window.addEventListener("resize", showNavBar);
  navBarButton.addEventListener("click", toggleNavBar);
});
