// Runs in MAIN world to intercept window.scrollTo and preserve scroll on report modals
(function() {
  if (window.__vwScrollScriptLoaded) return;
  window.__vwScrollScriptLoaded = true;

  let savedScrollY = 0;
  let isNavigatingReport = false;
  let navigationTimer = null;

  function markNavigating() {
    isNavigatingReport = true;
    if (navigationTimer) clearTimeout(navigationTimer);
    navigationTimer = setTimeout(() => {
      isNavigatingReport = false;
    }, 1200);
  }

  function getScrollTop() {
    return window.pageYOffset || document.documentElement.scrollTop || (document.body ? document.body.scrollTop : 0) || 0;
  }

  // Track the actual user scroll position continuously
  window.addEventListener('scroll', () => {
    // Only update savedScrollY when user is scrolling the main page and modal is NOT open
    const isModalOpen = document.body && (
      document.body.classList.contains('modal-open') || 
      !!document.querySelector('.modal.show')
    );
    if (!isModalOpen && !isNavigatingReport) {
      const currentY = getScrollTop();
      if (currentY > 0) {
        savedScrollY = currentY;
      }
    }
  }, { passive: true, capture: true });

  // When user clicks "Просмотр" or any row in reports table, remember the current position immediately
  document.addEventListener('click', (e) => {
    const target = e.target;
    if (target && target.closest) {
      const btn = target.closest('button, a, tr');
      if (btn) {
        const text = btn.textContent || '';
        if (text.includes('Просмотр') || btn.closest('table.table')) {
          const currentY = getScrollTop();
          if (currentY > 0) {
            savedScrollY = currentY;
          }
          markNavigating();
        }
      }
    }
  }, true);

  // Intercept history.pushState and replaceState (when React Router navigates to/from report modal)
  const origPushState = history.pushState;
  const origReplaceState = history.replaceState;

  function onHistoryChange(url) {
    const urlStr = String(url || '');
    if (urlStr.includes('/staff/reports') || urlStr.includes('/reports')) {
      const currentY = getScrollTop();
      if (currentY > 0) {
        savedScrollY = currentY;
      }
      markNavigating();
    }
  }

  history.pushState = function(...args) {
    onHistoryChange(args[2]);
    return origPushState.apply(this, args);
  };

  history.replaceState = function(...args) {
    onHistoryChange(args[2]);
    return origReplaceState.apply(this, args);
  };

  // Intercept window.scrollTo and window.scroll
  const origScrollTo = window.scrollTo;
  const origScroll = window.scroll;

  function shouldBlockScroll(args) {
    let targetY = null;
    if (typeof args[0] === 'number') {
      targetY = args[1] !== undefined ? args[1] : args[0];
    } else if (typeof args[0] === 'object' && args[0] !== null) {
      targetY = args[0].top;
    }

    // React Router calls scrollTo(0, 0)
    if (targetY === 0 || targetY === null) {
      const isReports = window.location.pathname.includes('/reports');
      const isModal = document.body && (
        document.body.classList.contains('modal-open') || 
        !!document.querySelector('.modal.show')
      );
      if (isReports && (isModal || isNavigatingReport)) {
        return true;
      }
    }
    return false;
  }

  window.scrollTo = function(...args) {
    if (shouldBlockScroll(args)) {
      return;
    }
    return origScrollTo.apply(this, args);
  };

  window.scroll = function(...args) {
    if (shouldBlockScroll(args)) {
      return;
    }
    return origScroll.apply(this, args);
  };

  // If the browser/React resets scrollTop on documentElement or body during navigation, restore it
  function restoreScrollIfNeeded() {
    if (savedScrollY > 0) {
      const currentY = getScrollTop();
      if (currentY === 0) {
        origScrollTo.call(window, 0, savedScrollY);
      }
    }
  }

  // Monitor DOM when modal closes or opens to ensure page stays at savedScrollY
  const observer = new MutationObserver(() => {
    if (isNavigatingReport) {
      restoreScrollIfNeeded();
    }
  });

  if (document.documentElement) {
    observer.observe(document.documentElement, { attributes: true, childList: true, subtree: true });
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      observer.observe(document.documentElement, { attributes: true, childList: true, subtree: true });
    });
  }
})();
