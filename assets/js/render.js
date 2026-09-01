/*
  Original template: Restoran (https://github.com/codewithshabbir/restoran)
  Heavily customized and extended for AYDOĞDU LOKANTASI.
*/

(function() {
  'use strict';

  function setText(el, text) {
    if (el) el.textContent = text;
  }

  function renderHero(d) {
    var h1 = document.querySelector('.banner-content h1');
    if (h1 && d.name) {
      h1.textContent = d.name;
    }
    setText(document.querySelector('.badge-years'), d.sinceBadge);
    setText(document.querySelector('.hero-subtitle'), d.tagline);
    setText(document.querySelector('.hero-desc'), d.description);
    var ctaMenu = document.querySelector('.book-a-table a');
    if (ctaMenu) ctaMenu.textContent = d.ctaMenu;
    var phoneLinks = document.querySelectorAll('a[href*="tel:"]');
    phoneLinks.forEach(function(el) {
      el.href = 'tel:' + d.phone.replace(/[^0-9]/g, '');
      if (el.id !== 'floating-phone') {
        setText(el, d.phone);
      }
    });
    var desktopSrc = document.querySelector('.hero-video-desktop source');
    if (desktopSrc && d.heroVideoDesktop) desktopSrc.src = d.heroVideoDesktop;
    var mobileSrc = document.querySelector('.hero-video-mobile source');
    if (mobileSrc && d.heroVideoMobile) mobileSrc.src = d.heroVideoMobile;
  }

  function renderHours(hours) {
    if (!hours) return;

    var groups = [];
    var currentGroup = null;
    hours.forEach(function(h) {
      if (!currentGroup || currentGroup.hours !== h.hours) {
        currentGroup = { days: [], hours: h.hours };
        groups.push(currentGroup);
      }
      currentGroup.days.push(h.day);
    });

    function label(group) {
      if (group.days.length === 1) return group.days[0];
      return group.days[0] + '\u2013' + group.days[group.days.length - 1];
    }

    var container = document.querySelector('.reservation-date-time');
    if (container) {
      container.innerHTML = '';
      groups.forEach(function(g) {
        var p = document.createElement('p');
        var b = document.createElement('b');
        b.textContent = label(g);
        p.appendChild(b);
        p.appendChild(document.createTextNode(' ' + g.hours));
        container.appendChild(p);
      });
    }

    var contactHours = document.querySelector('.contact-hours-list');
    if (contactHours) {
      contactHours.innerHTML = '';
      groups.forEach(function(g, i) {
        if (i > 0) contactHours.appendChild(document.createElement('br'));
        contactHours.appendChild(document.createTextNode(label(g) + ': ' + g.hours));
      });
    }
  }

  function renderContact(c) {
    if (!c) return;
    var addressEl = document.querySelector('.contact-info-box:first-child .ps-3 a');
    if (addressEl) {
      addressEl.href = c.mapsUrl || '#';
      setText(addressEl, c.address);
    }

    var socialLinks = {
      facebook: c.facebook || '#',
      instagram: c.instagram || '#',
      twitter: c.twitter || '#'
    };
    Object.keys(socialLinks).forEach(function(key) {
      var link = document.querySelector('.social-icons a[data-social="' + key + '"]');
      if (link) link.href = socialLinks[key];
    });
  }

  function renderFooter(d) {
    var aboutEl = document.querySelector('.content-desc p');
    if (aboutEl && d.footer) setText(aboutEl, d.footer.about);
  }

  function renderCategories(categories) {
    if (!categories) return;
    categories.forEach(function(cat) {
      var tab = document.querySelector('.menu-tab[href="#' + cat.id + '"]');
      if (tab) {
        var tabIcon = tab.querySelector('.menu-icon');
        tab.textContent = '';
        if (tabIcon) tab.appendChild(tabIcon);
        tab.appendChild(document.createTextNode(' ' + cat.name));
      }

      var section = document.getElementById(cat.id);
      if (!section) return;
      var titleEl = section.querySelector('.menu-category-title');
      if (titleEl) {
        var iconSvg = titleEl.querySelector('.menu-icon');
        titleEl.textContent = '';
        if (iconSvg) {
          titleEl.appendChild(iconSvg);
        }
        titleEl.appendChild(document.createTextNode(' ' + cat.name));
      }

      var noteEl = section.querySelector('.category-note');
      if (noteEl) {
        setText(noteEl, cat.note || '');
        noteEl.style.display = cat.note ? '' : 'none';
      }

      var img = section.querySelector('.food-placeholder img');
      if (img && cat.image) {
        img.src = cat.image;
        img.alt = cat.name;
      }

      var items = section.querySelectorAll('.item-wrapper');
      items.forEach(function(wrapper, idx) {
        if (idx >= cat.items.length) return;
        var item = cat.items[idx];
        var h5 = wrapper.querySelector('.item-left h5');
        var desc = wrapper.querySelector('.item-left p');
        var priceEl = wrapper.querySelector('.item-price');
        if (h5) {
          h5.textContent = item.name;
          if (item.featuredLabel) {
            var span = document.createElement('span');
            span.className = 'featured-badge';
            span.textContent = item.featuredLabel;
            h5.appendChild(document.createTextNode(' '));
            h5.appendChild(span);
          }
        }
        if (desc) setText(desc, item.description);
        if (priceEl) {
          var priceText = item.priceHalf ? (item.price + ' / ' + item.priceHalf) : ('' + item.price);
          priceEl.textContent = '';
          priceEl.appendChild(document.createTextNode(priceText + ' '));
          var sym = document.createElement('span');
          sym.className = 'price-symbol';
          sym.textContent = '₺';
          priceEl.appendChild(sym);
        }
      });
    });
  }

  fetch('./data.json?t=' + Date.now(), { cache: 'no-store' })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (data.restaurant) renderHero(data.restaurant);
      if (data.categories) renderCategories(data.categories);
      if (data.contact) renderContact(data.contact);
      if (data.hours) renderHours(data.hours);
      renderFooter(data);
    })
    .catch(function(err) {
      console.warn('CMS data unavailable, using static fallback.', err);
    });
})();
