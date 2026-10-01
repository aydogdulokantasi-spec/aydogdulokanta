/*
  Original template: Restoran (https://github.com/codewithshabbir/restoran)
  Heavily customized and extended for AYDOĞDU LOKANTASI.
*/

// Açılış ekranı (loader) kaldırıldı: sayfa her ziyarette 3 sn bekletiliyordu.

// Header functionality
var getHamburgerIcon = document.getElementById("hamburger");
var getHamburgerCrossIcon = document.getElementById("hamburger-cross");
var getMobileMenu = document.getElementById("mobile-menu");

// Open the mobile menu
getHamburgerIcon.addEventListener("click", function () {
    getMobileMenu.style.transform = "translateX(0%)";
});

// Close the mobile menu
function closeMenu() {
    getMobileMenu.style.transform = "translateX(-100%)";
}

// Close the mobile menu when the close icon is clicked
getHamburgerCrossIcon.addEventListener("click", closeMenu);

// Close the mobile menu when a link inside it is clicked
getMobileMenu.querySelectorAll("a").forEach(function(link) {
  link.addEventListener("click", closeMenu);
});

// Close the mobile menu if clicking outside of it
document.addEventListener("click", function(event) {
    var isClickInsideMenu = getMobileMenu.contains(event.target);
    var isClickOnIcon = getHamburgerIcon.contains(event.target);

    if (!isClickInsideMenu && !isClickOnIcon) {
        closeMenu();
    }
});




// Header scroll behavior
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  const headerClass = document.querySelector('.header');

  const checkScroll = () => {
    if (window.scrollY > 10) {
      header.classList.add('scrolled');
      headerClass.classList.remove('my-1');
      headerClass.classList.add('my-0');
      sessionStorage.setItem('scrolled', 'true');
      
    } else {
      header.classList.remove('scrolled');
      headerClass.classList.add('my-1');
      headerClass.classList.remove('my-0');
      sessionStorage.removeItem('scrolled');
    }
  };

  // Check scroll position on page load
  if (sessionStorage.getItem('scrolled') === 'true') {
    header.classList.add('scrolled');
    headerClass.classList.remove('my-1');
    headerClass.classList.add('my-0');
  }
  window.addEventListener('scroll', checkScroll);  
  checkScroll(); // Initial check
});



// Menu tabs – sticky, scroll, active tracking
(function() {
  var tabsBar = document.querySelector('.menu-tabs');
  var tabs = document.querySelectorAll('.menu-tab');
  var categories = document.querySelectorAll('.menu-category');
  var menuSection = document.getElementById('menu');
  if (!tabsBar || !tabs.length || !categories.length || !menuSection) return;

  var ticking = false;
  var headerHeight = 66;
  var justClicked = false;

  function updateHeaderHeight() {
    var h = document.querySelector('header');
    if (h) headerHeight = h.getBoundingClientRect().bottom;
  }
  updateHeaderHeight();
  tabsBar.style.top = headerHeight + 'px';

  window.addEventListener('scroll', function() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function() {
      updateHeaderHeight();
      tabsBar.style.top = headerHeight + 'px';

      if (tabsBar.getBoundingClientRect().top <= headerHeight + 1) {
        tabsBar.classList.add('is-sticky');
      } else {
        tabsBar.classList.remove('is-sticky');
      }

      var activeOffset = headerHeight + (tabsBar.offsetHeight || 50) + 25;
      var triggerLine = window.scrollY + activeOffset;
      var activeId = null;
      categories.forEach(function(cat) {
        if (cat.getBoundingClientRect().top + window.pageYOffset <= triggerLine) activeId = cat.id;
      });
      if (!justClicked) {
        tabs.forEach(function(t) { t.classList.remove('active'); });
        if (activeId) {
          var tab = document.querySelector('.menu-tab[href="#' + activeId + '"]');
          if (tab) tab.classList.add('active');
        }
      }
      if (document.activeElement && document.activeElement.classList.contains('menu-tab')) {
        document.activeElement.blur();
      }
      ticking = false;
    });
  });

  window.addEventListener('resize', function() {
    updateHeaderHeight();
    tabsBar.style.top = headerHeight + 'px';
  });

  // Smooth scroll on click
  tabs.forEach(function(tab) {
    tab.addEventListener('click', function(e) {
      e.preventDefault();
      justClicked = true;
      setTimeout(function() { justClicked = false; }, 1000);
      tabs.forEach(function(t) { t.classList.remove('active'); });
      this.classList.add('active');
      updateHeaderHeight();
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        var offset = headerHeight + (tabsBar.offsetHeight || 50) + 15;
        var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });
})();

var backToTop = document.getElementById('back-to-top');
var bttTicking = false;
window.addEventListener('scroll', function() {
  if (bttTicking) return;
  bttTicking = true;
  requestAnimationFrame(function() {
    if (window.scrollY > 300) {
      backToTop.style.display = 'flex';
    } else {
      backToTop.style.display = 'none';
    }
    bttTicking = false;
  });
});

document.getElementById('copyrightCurrentYear').textContent = new Date().getFullYear();


