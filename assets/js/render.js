/*
  Original template: Restoran (https://github.com/codewithshabbir/restoran)
  Heavily customized and extended for AYDOĞDU LOKANTASI.
*/

(function() {
  'use strict';

  // İngilizce sayfa (en.html): <html lang="en"> ise metinler window.EN_TEXT sözlüğünden çevrilir.
  // Fiyatlar her iki dilde de data.json'dan gelir. Sözlükte karşılığı olmayan yeni ürün Türkçe görünür.
  var IS_EN = (document.documentElement.lang || '').toLowerCase().indexOf('en') === 0;
  var EN_TEXT = window.EN_TEXT || {};
  function t(s) { return (IS_EN && s && EN_TEXT[s]) ? EN_TEXT[s] : s; }

  function setText(el, text) {
    if (el) el.textContent = text;
  }

  function renderHero(d) {
    var h1 = document.querySelector('.banner-content h1');
    if (h1 && d.name) {
      h1.textContent = d.name;
    }
    if (!IS_EN) {
      setText(document.querySelector('.badge-years'), d.sinceBadge);
      setText(document.querySelector('.hero-subtitle'), d.tagline);
      if (d.heroDesc) setText(document.querySelector('.hero-desc'), d.heroDesc);
      renderStory(d.description);
      var ctaMenu = document.querySelector('.book-a-table a');
      if (ctaMenu) ctaMenu.textContent = d.ctaMenu;
    }
    var phoneLinks = document.querySelectorAll('a[href*="tel:"]');
    phoneLinks.forEach(function(el) {
      el.href = 'tel:' + d.phone.replace(/[^0-9]/g, '');
      if (el.id !== 'floating-phone' && !el.hasAttribute('data-keep-text')) {
        setText(el, d.phone);
      }
    });
    // Video kaynağı yalnızca CMS'te farklı bir dosya girildiyse değiştirilir
    // (aynı dosyayı yeniden atamak indirmeyi baştan başlatır).
    var heroVideo = document.querySelector('.hero-video');
    var wanted = d.heroVideoDesktop || d.heroVideoMobile;
    if (heroVideo && wanted) {
      var cur = heroVideo.getAttribute('data-src') || heroVideo.getAttribute('src') || '';
      if (cur.replace(/^\.\//, '') !== String(wanted).replace(/^\.\//, '')) {
        heroVideo.setAttribute('data-src', wanted);
        if (heroVideo.getAttribute('src')) heroVideo.src = wanted; // video zaten başladıysa değiştir
      }
    }
  }

  // Uzun hikâye metni ana ekrana değil, #hikayemiz bölümüne basılır.
  // Paragraflar boş satırla ayrılır; tek satır sonları korunur (CSS: pre-line).
  function renderStory(text) {
    var box = document.querySelector('#hikayemiz .story-body');
    if (!box || !text) return;
    var parts = String(text).split(/\n\s*\n/).map(function(t) { return t.trim(); }).filter(Boolean);
    if (!parts.length) return;
    box.innerHTML = '';
    parts.forEach(function(t, i) {
      var p = document.createElement('p');
      if (i === 0) p.className = 'story-lead';
      p.textContent = i === 0 ? t.replace(/[;:,]\s*$/, '') : t;
      box.appendChild(p);
    });
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
      if (group.days.length === 1) return t(group.days[0]);
      return t(group.days[0]) + '\u2013' + t(group.days[group.days.length - 1]);
    }

    var container = document.querySelector('.reservation-date-time');
    if (container) {
      container.innerHTML = '';
      groups.forEach(function(g) {
        var p = document.createElement('p');
        var b = document.createElement('b');
        b.textContent = label(g);
        p.appendChild(b);
        p.appendChild(document.createTextNode(' ' + t(g.hours)));
        container.appendChild(p);
      });
    }

    var contactHours = document.querySelector('.contact-hours-list');
    if (contactHours) {
      contactHours.innerHTML = '';
      groups.forEach(function(g, i) {
        if (i > 0) contactHours.appendChild(document.createElement('br'));
        contactHours.appendChild(document.createTextNode(label(g) + ': ' + t(g.hours)));
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
    if (IS_EN) return;
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
        tab.appendChild(document.createTextNode(' ' + t(cat.name)));
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
        titleEl.appendChild(document.createTextNode(' ' + t(cat.name)));
      }

      var noteEl = section.querySelector('.category-note');
      if (noteEl) {
        setText(noteEl, t(cat.note) || '');
        noteEl.style.display = cat.note ? '' : 'none';
      }

      var img = section.querySelector('.food-placeholder img');
      if (img && cat.image) {
        img.src = cat.image;
        img.alt = t(cat.name);
      }

      var items = section.querySelectorAll('.item-wrapper');
      items.forEach(function(wrapper, idx) {
        if (idx >= cat.items.length) return;
        var item = cat.items[idx];
        var h5 = wrapper.querySelector('.item-left h5');
        var desc = wrapper.querySelector('.item-left p');
        var priceEl = wrapper.querySelector('.item-price');
        if (h5) {
          h5.textContent = t(item.name);
          if (item.featuredLabel) {
            var span = document.createElement('span');
            span.className = 'featured-badge';
            span.textContent = t(item.featuredLabel);
            h5.appendChild(document.createTextNode(' '));
            h5.appendChild(span);
          }
        }
        if (desc) setText(desc, t(item.description));
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
