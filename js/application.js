var mobileListeners = false;

function setup() {
  detectWebpSupport();
  positionCTAButton();
  setupButtonObserver();
  setupCollapsibles();
  //setupCookieNotice();
  setupCurrentYear();
  if (isMobile()) { setupMobileNav(); }
  setupResizeObserver();
}

function detectWebpSupport() {
  var webpData = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
  var img = new Image();
  img.onload = function () {
    var result = (img.width > 0) && (img.height > 0);
    if (result) { 
      document.documentElement.classList.add('webp');
      document.documentElement.classList.remove('no-webp');
    }
  };
  img.src = webpData;
}

function handleMenuButtonClick() {
  var expanded = this.getAttribute('aria-expanded') === 'true' || false;
  this.setAttribute('aria-expanded', !expanded);
  var menu = document.querySelector('#site-menu');
  menu.style.display = expanded ? 'none' : 'block';
  var subMenuButtons = document.querySelectorAll('#site-menu li button');
  subMenuButtons.forEach(function(button) {
    button.setAttribute('aria-expanded', false);
  });
  var subMenus = document.querySelectorAll('#site-menu li ul');
  subMenus.forEach(function(subMenu) {
    subMenu.style.display = 'none';
  });
}

function handleSectionButtonClick() {
  var currentButton = this;
  var expanded = currentButton.getAttribute('aria-expanded') === 'true' || false;
  currentButton.setAttribute('aria-expanded', !expanded);
  var subMenu = currentButton.nextElementSibling;
  subMenu.style.display = expanded ? 'none' : 'block';
  var sectionButtons = document.querySelectorAll('#site-menu button');
  sectionButtons.forEach(function(item) {
    if (item !== currentButton) {
      item.setAttribute('aria-expanded', false);
      item.nextElementSibling.style.display = 'none';
    }
  });
}

function isMobile() {
  var mobileControls = document.querySelector('#mobile-menu-controls');
  var styles = getComputedStyle(mobileControls);
  var display;
  for (var i = 0; i < styles.length; i++) {
    if (styles[i] === 'display') {
      display =  styles.getPropertyValue(styles[i]);
    }
  }
  return display === 'none' ? false : true;
}

function positionCTAButton() {
  var ctaButton = document.querySelector("#call-to-action");
  var fixedButton = document.querySelector('#fixed-call-to-action');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function(entries) {
      fixedButton.hidden = entries[0].isIntersecting;
    }, { threshold: [1] });
    observer.observe(ctaButton);
  } else {
    var bounding = ctaButton.getBoundingClientRect();
    var isInViewport = (
      bounding.top >= 0 &&
      bounding.left >= 0 &&
      bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
    fixedButton.hidden = isInViewport;
  }
}

function removeMobileNavListeners() {
  var navButton = document.querySelector('#site-menu-btn');
  navButton.removeEventListener('click', handleMenuButtonClick);
  var sectionButtons = document.querySelectorAll('#site-menu button');
  sectionButtons.forEach(function(button) {
    button.removeEventListener('click', handleSectionButtonClick);
  });
  mobileListeners = false;
}

function setupButtonObserver() {
  window.addEventListener('scroll', throttle(positionCTAButton, 500));
}

function setupCognitoForm() {
  if (document.getElementById('email-us')) {
    Cognito.load("forms", { id: "1" });
  }
}

function setupCollapsibles() {
  var collapsibleButtons = document.querySelectorAll('.collapsible button');
  collapsibleButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      var expanded = this.getAttribute('aria-expanded') === 'true' || false;
      this.setAttribute('aria-expanded', !expanded);
      var sibling = this.nextElementSibling;
      sibling.hidden = expanded;
    });
  });
}

function setupCookieNotice() {
  var cookies = document.cookie;
  if (!cookies.split(';').some(function(item) {
    return item.trim().indexOf('domain=oregonboatingfoundation.org') == 0;
  })) {
    var cookieNotice = document.querySelector('#cookies');
    cookieNotice.hidden = false;
    var cookieBtn = document.querySelector('#cookie-btn');
    cookieBtn.addEventListener('click', function() {
      var cookieData = "domain=oregonboatingfoundation.org";
      cookieData += ",acceptCookies=true,expires=";
      cookieData += ",expires=Fri, 31 Dec 9999 23:59:59 GMT";
      document.cookie = cookieData;
      cookieNotice.hidden = true;
    });
  }
}

function setupCurrentYear() {
  var currentYears = document.querySelectorAll('.current-year');
  currentYears.forEach(function(year) {
    var date = new Date();
    year.textContent = date.getFullYear();
  });
}

function setupMobileNav() {
  var navButton = document.querySelector('#site-menu-btn');
  navButton.addEventListener('click', handleMenuButtonClick);
  var sectionButtons = document.querySelectorAll('#site-menu button');
  sectionButtons.forEach(function(button) {
    button.addEventListener('click', handleSectionButtonClick);
  });
  mobileListeners = true;
}

function setupResizeObserver() {
  window.addEventListener('resize', function() {
    if (isMobile()) {
      if (!mobileListeners) { setupMobileNav(); }
    } else {
      if (mobileListeners) { removeMobileNavListeners(); }
    }
  });
}

function throttle(func, limit) {
  var lastFunc;
  var lastRan;
  return function() {
    var context = this;
    var args = arguments;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(function() {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}

document.addEventListener("DOMContentLoaded", setup);
window.addEventListener("load", setupCognitoForm);

