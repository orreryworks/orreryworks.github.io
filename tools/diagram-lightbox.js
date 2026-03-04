/**
 * Diagram lightbox for Orrery documentation
 *
 * Wraps rendered diagram images in a container with a magnifier icon.
 * Clicking a diagram opens a full-size lightbox modal.
 *
 * Works on any page that contains images whose alt text starts with
 * "Rendered" — this covers both mdBook (`alt="Rendered diagram"`) and
 * the Zola landing page (`alt="Rendered sequence diagram …"` etc.).
 */

(function () {
  'use strict';

  var SELECTOR = 'img[alt^="Rendered"]';

  // SVG magnifier icon (search/zoom-in)
  var MAGNIFIER_SVG =
    '<svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5"/>' +
    '<line x1="15.5" y1="15.5" x2="21" y2="21"/></svg>';

  /** Wrap each diagram image in a container with a zoom icon. */
  function wrapDiagrams() {
    var imgs = document.querySelectorAll(SELECTOR);
    imgs.forEach(function (img) {
      // Skip if already wrapped
      if (img.parentElement.classList.contains('diagram-container')) return;

      var container = document.createElement('div');
      container.className = 'diagram-container';

      var icon = document.createElement('span');
      icon.className = 'diagram-zoom-icon';
      icon.innerHTML = MAGNIFIER_SVG;

      img.parentNode.insertBefore(container, img);
      container.appendChild(img);
      container.appendChild(icon);

      container.addEventListener('click', function () {
        openLightbox(img.src);
      });
    });
  }

  /** Open the lightbox modal with the given image source. */
  function openLightbox(src) {
    // Backdrop
    var overlay = document.createElement('div');
    overlay.className = 'diagram-lightbox';

    // Content box
    var content = document.createElement('div');
    content.className = 'diagram-lightbox-content';

    // Close button
    var close = document.createElement('button');
    close.className = 'diagram-lightbox-close';
    close.textContent = '\u00D7'; // ×
    close.setAttribute('aria-label', 'Close');

    // Full-size image
    var img = document.createElement('img');
    img.src = src;
    img.alt = 'Rendered diagram (full size)';

    content.appendChild(close);
    content.appendChild(img);
    overlay.appendChild(content);
    document.body.appendChild(overlay);

    // Prevent page scroll while modal is open
    document.body.style.overflow = 'hidden';

    // Trigger fade-in on next frame
    requestAnimationFrame(function () {
      overlay.classList.add('visible');
    });

    function dismiss() {
      overlay.classList.remove('visible');
      overlay.addEventListener('transitionend', function () {
        overlay.remove();
        document.body.style.overflow = '';
      });
    }

    // Close on backdrop click (not content)
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) dismiss();
    });

    // Close on button click
    close.addEventListener('click', dismiss);

    // Close on ESC key
    function onKey(e) {
      if (e.key === 'Escape') {
        dismiss();
        document.removeEventListener('keydown', onKey);
      }
    }
    document.addEventListener('keydown', onKey);
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wrapDiagrams);
  } else {
    wrapDiagrams();
  }
})();
