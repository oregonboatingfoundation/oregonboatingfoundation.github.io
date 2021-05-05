let mobileListeners = false;

function setup() {
  positionCTAButton();
  setupButtonObserver();
  setupCollapsibles();
  //setupCookieNotice();
  setupCurrentYear();
  if (isMobile()) { setupMobileNav(); }
  setupResizeObserver();
}

function handleMenuButtonClick() {
  let expanded = this.getAttribute('aria-expanded') === 'true' || false;
  this.setAttribute('aria-expanded', !expanded);
  let menu = document.querySelector('#site-menu');
  menu.style.display = expanded ? 'none' : 'block';
  const subMenuButtons = document.querySelectorAll('#site-menu li button');
  subMenuButtons.forEach(function(button) {
    button.setAttribute('aria-expanded', false);
  });
  const subMenus = document.querySelectorAll('#site-menu li ul');
  subMenus.forEach(function(subMenu) {
    subMenu.style.display = 'none';
  });
}

function handleSectionButtonClick() {
  let currentButton = this;
  let expanded = currentButton.getAttribute('aria-expanded') === 'true' || false;
  currentButton.setAttribute('aria-expanded', !expanded);
  let subMenu = currentButton.nextElementSibling;
  subMenu.style.display = expanded ? 'none' : 'block';
  const sectionButtons = document.querySelectorAll('#site-menu button');
  sectionButtons.forEach(function(item) {
    if (item !== currentButton) {
      item.setAttribute('aria-expanded', false);
      item.nextElementSibling.style.display = 'none';
    }
  });
}

function isMobile() {
  const mobileControls = document.querySelector('#mobile-menu-controls');
  let styles = getComputedStyle(mobileControls)
  let display;
  for (var i = 0; i < styles.length; i++) {
    if (styles[i] === 'display') {
      display =  styles.getPropertyValue(styles[i]);
    }
  }
  return display === 'none' ? false : true;
}

function positionCTAButton() {
  const fixedButton = document.querySelector('#fixed-call-to-action');
  const observer = new IntersectionObserver(function(entries) {
    fixedButton.hidden = entries[0].isIntersecting;
  }, { threshold: [1] });
  observer.observe(document.querySelector("#call-to-action"));
}

function removeMobileNavListeners() {
  const navButton = document.querySelector('#site-menu-btn');
  navButton.removeEventListener('click', handleMenuButtonClick);
  const sectionButtons = document.querySelectorAll('#site-menu button');
  sectionButtons.forEach(function(button) {
    button.removeEventListener('click', handleSectionButtonClick);
  });
  mobileListeners = false;
}

function setupButtonObserver() {
  window.addEventListener('scroll', throttle(positionCTAButton, 500));
}

function setupCognitoForm() {
  if (document.getElementById('cognito-form')) {
    Cognito.load("forms", { id: "1" });
  }
}

function setupCollapsibles() {
  const collapsibleButtons = document.querySelectorAll('.collapsible button');
  collapsibleButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      let expanded = this.getAttribute('aria-expanded') === 'true' || false;
      this.setAttribute('aria-expanded', !expanded);
      let sibling = this.nextElementSibling;
      sibling.hidden = expanded;
    });
  });
}

function setupCookieNotice() {
  let cookies = document.cookie;
  if (!cookies.split(';').some(function(item) {
    return item.trim().indexOf('domain=oregonboatingfoundation.org') == 0
  })) {
    let cookieNotice = document.querySelector('#cookies');
    cookieNotice.style.display = 'flex';
    const cookieBtn = document.querySelector('#cookie-btn');
    cookieBtn.addEventListener('click', function() {
      let cookieData = "domain=oregonboatingfoundation.org";
      cookieData += ",acceptCookies=true,expires=";
      cookieData += ",expires=Fri, 31 Dec 9999 23:59:59 GMT";
      document.cookie = cookieData;
      cookieNotice.style.display = 'none';
    });
  }
}

function setupCurrentYear() {
  const currentYears = document.querySelectorAll('.current-year');
  currentYears.forEach(function(year) {
    let date = new Date();
    year.textContent = date.getFullYear();
  });
}

function setupMobileNav() {
  const navButton = document.querySelector('#site-menu-btn');
  navButton.addEventListener('click', handleMenuButtonClick);
  const sectionButtons = document.querySelectorAll('#site-menu button');
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
  let lastFunc;
  let lastRan;
  return function() {
    const context = this;
    const args = arguments;
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
  }
}

document.addEventListener("DOMContentLoaded", setup);
document.addEventListener("load", setupCognitoForm);

