export const themeScript = `
(function() {
  try {
    var storageKey = 'next-sass-theme-settings';
    var stored = localStorage.getItem(storageKey);
    var root = document.documentElement;

    // SECURITY: Whitelist of valid values for each setting
    var valid = {
      themeMode: ['light', 'dark', 'system'],
      colorScheme: ['default', 'neutral', 'sky', 'navy', 'blue', 'cyan', 'yellow', 'orange'],
      fontSize: ['small', 'medium', 'large'],
      fontFamily: ['geist', 'inter', 'jakarta', 'open-sans', 'system'],
      sidebarMode: ['normal', 'compact', 'offcanvas'],
      sidebarTheme: ['default', 'dark', 'brand', 'image', 'aurora'],
      contentMode: ['compact', 'full'],
      contentView: ['carded', 'boxed'],
      sidebarImageBrightness: ['bright', 'medium', 'dark']
    };

    function isValid(key, value) {
      return valid[key] && valid[key].indexOf(value) !== -1;
    }

    var migrationMap = {
      'carbon': 'neutral', 'slate': 'sky', 'teal': 'cyan',
      'gold': 'yellow', 'amber': 'orange', 'indigo': 'blue',
      'crimson': 'neutral', 'zinc': 'neutral', 'rose': 'neutral', 'green': 'yellow'
    };

    var defaults = {
      themeMode: 'light', colorScheme: 'blue', fontSize: 'small',
      fontFamily: 'geist', sidebarMode: 'normal', sidebarTheme: 'brand',
      contentMode: 'full', contentView: 'carded', radius: 0.5,
      sidebarImageBrightness: 'dark'
    };
    var defaultImg = 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=80';
    var colorScheme = defaults.colorScheme;

    if (stored) {
      var settings = JSON.parse(stored);

      if (settings.colorScheme && migrationMap[settings.colorScheme]) {
        settings.colorScheme = migrationMap[settings.colorScheme];
        localStorage.setItem(storageKey, JSON.stringify(settings));
      }

      // Validate and apply theme mode
      var mode = isValid('themeMode', settings.themeMode) ? settings.themeMode : defaults.themeMode;
      if (mode === 'system') {
        var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        root.classList.add(systemTheme);
      } else {
        root.classList.add(mode);
      }

      // Validate and apply all attributes
      var fs = isValid('fontSize', settings.fontSize) ? settings.fontSize : defaults.fontSize;
      var ff = isValid('fontFamily', settings.fontFamily) ? settings.fontFamily : defaults.fontFamily;
      colorScheme = isValid('colorScheme', settings.colorScheme) ? settings.colorScheme : defaults.colorScheme;
      var sm = isValid('sidebarMode', settings.sidebarMode) ? settings.sidebarMode : defaults.sidebarMode;
      var cm = isValid('contentMode', settings.contentMode) ? settings.contentMode : defaults.contentMode;
      var cv = isValid('contentView', settings.contentView) ? settings.contentView : defaults.contentView;

      root.setAttribute('data-font-size', fs);
      root.setAttribute('data-font-family', ff);
      root.setAttribute('data-color-scheme', colorScheme);
      root.setAttribute('data-sidebar-mode', sm);

      var isDark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      var st = isValid('sidebarTheme', settings.sidebarTheme) ? settings.sidebarTheme : defaults.sidebarTheme;
      root.setAttribute('data-sidebar-theme', isDark ? 'default' : st);

      root.setAttribute('data-content-mode', cm);
      root.setAttribute('data-content-view', cv);

      // Validate radius: must be a finite number between 0 and 2
      var radius = parseFloat(settings.radius);
      if (isNaN(radius) || radius < 0 || radius > 2) radius = defaults.radius;
      root.style.setProperty('--radius', radius + 'rem');

      // SECURITY: Validate URL before CSS injection
      var imgUrl = settings.sidebarImageUrl || defaultImg;
      try { new URL(imgUrl); } catch(e) { imgUrl = defaultImg; }
      root.style.setProperty('--sidebar-bg-image', 'url("' + imgUrl.replace(/["\\\\]/g, '') + '")');

      var ib = isValid('sidebarImageBrightness', settings.sidebarImageBrightness) ? settings.sidebarImageBrightness : defaults.sidebarImageBrightness;
      root.setAttribute('data-sidebar-image-brightness', ib);
    } else {
      root.classList.add('light');
      root.setAttribute('data-font-size', defaults.fontSize);
      root.setAttribute('data-font-family', defaults.fontFamily);
      root.setAttribute('data-color-scheme', defaults.colorScheme);
      root.setAttribute('data-sidebar-mode', defaults.sidebarMode);
      root.setAttribute('data-sidebar-theme', defaults.sidebarTheme);
      root.setAttribute('data-content-mode', defaults.contentMode);
      root.setAttribute('data-content-view', defaults.contentView);
      root.style.setProperty('--radius', defaults.radius + 'rem');
      root.style.setProperty('--sidebar-bg-image', 'url("' + defaultImg + '")');
      root.setAttribute('data-sidebar-image-brightness', defaults.sidebarImageBrightness);
    }

    // Apply color scheme to body once it exists
    var applyBodyScheme = function() {
      if (document.body) {
        document.body.setAttribute('data-color-scheme', colorScheme);
      }
    };
    if (document.body) {
      applyBodyScheme();
    } else {
      document.addEventListener('DOMContentLoaded', applyBodyScheme);
    }
  } catch (e) {
    console.error('Failed to apply theme settings', e);
  }
})();
`;
