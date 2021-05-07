/**
 * Need to do this before accessing any DOM elements, as it waits for the initial
 * HTML document to load (but not waiting for any stylesheets, images, and
 * subframes to finish loading)
 */
document.addEventListener("DOMContentLoaded", function () {
  window.addEventListener("scroll", updateNavBar);
  window.addEventListener("resize", calcSectionOffets);

  const navBarLinks = document.getElementsByClassName("navbar-link");
  let sectionOffsets = [];

  function calcSectionOffets() {
    sectionOffsets = [];
    for (let section of document.getElementsByTagName("section")) {
      sectionOffsets.push(section.offsetTop);
    }
  }

  calcSectionOffets();

  /**
   * Modifies the navbar from absolute to fixed position and vice versa. Also
   * changes which navbar item is highlighted
   */
  function updateNavBar() {
    const arrowDownPos = document.getElementById("arrow-box").offsetTop;
    const navBar = document.getElementById("navbar");
    if (window.pageYOffset >= arrowDownPos) {
      navBar.classList.add("sticky");
    } else {
      navBar.classList.remove("sticky");
    }

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
});
