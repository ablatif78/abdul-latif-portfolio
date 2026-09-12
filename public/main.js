(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- theme ---------- */

  var toggle = document.querySelector('[data-theme-toggle]');
  var media = window.matchMedia('(prefers-color-scheme: dark)');

  function label(theme) {
    return theme === 'dark' ? 'Switch to the day theme' : 'Switch to the night theme';
  }

  function applyTheme(theme, remember) {
    root.setAttribute('data-theme', theme);
    if (toggle) toggle.setAttribute('aria-label', label(theme));
    if (remember) {
      try {
        localStorage.setItem('theme', theme);
      } catch (error) {
        /* private mode — the choice just will not persist */
      }
    }
  }

  applyTheme(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light', false);

  if (toggle) {
    toggle.addEventListener('click', function () {
      applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true);
    });
  }

  media.addEventListener('change', function (event) {
    var stored = null;
    try {
      stored = localStorage.getItem('theme');
    } catch (error) {
      /* ignore */
    }
    if (!stored) applyTheme(event.matches ? 'dark' : 'light', false);
  });

  /* ---------- scroll: progress bar, sticky bar, reveals, active link ---------- */

  var progress = document.querySelector('[data-progress]');
  var topbar = document.querySelector('[data-topbar]');
  var ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var ratio = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      if (progress) progress.style.transform = 'scaleX(' + ratio + ')';
      if (topbar) topbar.classList.toggle('is-stuck', window.scrollY > 12);
      ticking = false;
    });
  }

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  var revealables = document.querySelectorAll('[data-reveal]');

  if (!('IntersectionObserver' in window) || reduceMotion) {
    Array.prototype.forEach.call(revealables, function (element) {
      element.classList.add('is-in');
    });
  } else {
    var revealer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          revealer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
    );

    Array.prototype.forEach.call(revealables, function (element) {
      revealer.observe(element);
    });
  }

  var links = Array.prototype.slice.call(document.querySelectorAll('[data-navlink]'));
  var sections = links
    .map(function (link) {
      return document.querySelector(link.getAttribute('href'));
    })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var visible = new Set();
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            visible.add(entry.target.id);
          } else {
            visible.delete(entry.target.id);
          }
        });

        var active = sections.find(function (section) {
          return visible.has(section.id);
        });

        links.forEach(function (link) {
          if (active && link.getAttribute('href') === '#' + active.id) {
            link.setAttribute('aria-current', 'true');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      },
      { rootMargin: '-22% 0px -70% 0px', threshold: 0 },
    );

    sections.forEach(function (section) {
      spy.observe(section);
    });
  }

  /* ---------- contact form ---------- */

  var form = document.getElementById('contact-form');
  if (!form) return;

  var status = form.querySelector('[data-status]');
  var submit = form.querySelector('[data-submit]');
  var submitLabel = form.querySelector('[data-submit-label]');
  var fields = ['name', 'email', 'subject', 'message', 'website'];

  function setStatus(text, state) {
    status.textContent = text;
    if (state) {
      status.setAttribute('data-state', state);
    } else {
      status.removeAttribute('data-state');
    }
  }

  function setBusy(busy) {
    submit.disabled = busy;
    submit.classList.toggle('is-busy', busy);
    submitLabel.textContent = busy ? 'Sending' : 'Send message';
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var payload = {};
    fields.forEach(function (name) {
      var input = form.elements[name];
      if (!input) return;
      input.removeAttribute('aria-invalid');
      var value = input.value.trim();
      if (value) payload[name] = value;
    });

    var missing = ['name', 'email', 'message'].filter(function (name) {
      return !payload[name];
    });

    if (missing.length) {
      missing.forEach(function (name) {
        form.elements[name].setAttribute('aria-invalid', 'true');
      });
      form.elements[missing[0]].focus();
      setStatus('Fill in your name, email and message.', 'error');
      return;
    }

    setBusy(true);
    setStatus('Sending…');

    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(function (response) {
        return response
          .json()
          .catch(function () {
            return {};
          })
          .then(function (body) {
            return { response: response, body: body };
          });
      })
      .then(function (result) {
        if (result.response.ok) {
          form.reset();
          setStatus(result.body.message || 'Thanks — your message is on its way.', 'ok');
          return;
        }

        if (result.response.status === 429) {
          setStatus('That is a few messages already. Try again a little later.', 'error');
          return;
        }

        var message = result.body.message;
        setStatus(
          Array.isArray(message) ? message[0] : message || 'The message could not be sent.',
          'error',
        );
      })
      .catch(function () {
        setStatus('Network problem — check your connection and try again.', 'error');
      })
      .finally(function () {
        setBusy(false);
      });
  });
})();
