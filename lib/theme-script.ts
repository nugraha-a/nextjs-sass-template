export const themeScript = `
(function() {
  try {
    var storageKey = 'next-sass-theme-settings';
    var stored = localStorage.getItem(storageKey);
    var root = document.documentElement;

    var migrationMap = {
      'carbon': 'neutral',
      'slate': 'sky',
      'teal': 'cyan',
      'gold': 'yellow',
      'amber': 'orange',
      'indigo': 'blue',
      'crimson': 'neutral',
      'zinc': 'neutral',
      'rose': 'neutral',
      'green': 'yellow'
    };

    var colorScheme = 'blue';

    if (stored) {
      var settings = JSON.parse(stored);

      if (settings.colorScheme && migrationMap[settings.colorScheme]) {
        settings.colorScheme = migrationMap[settings.colorScheme];
        localStorage.setItem(storageKey, JSON.stringify(settings));
      }

      if (settings.themeMode === 'system') {
        var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        root.classList.add(systemTheme);
      } else if (settings.themeMode) {
        root.classList.add(settings.themeMode);
      }

      root.setAttribute('data-font-size', settings.fontSize || 'small');
      root.setAttribute('data-font-family', settings.fontFamily || 'geist');
      colorScheme = settings.colorScheme || 'blue';
      root.setAttribute('data-color-scheme', colorScheme);
      root.setAttribute('data-sidebar-mode', settings.sidebarMode || 'normal');
      var isDark = settings.themeMode === 'dark' || (settings.themeMode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      root.setAttribute('data-sidebar-theme', isDark ? 'default' : (settings.sidebarTheme || 'brand'));
      root.setAttribute('data-content-mode', settings.contentMode || 'full');
      root.setAttribute('data-content-view', settings.contentView || 'carded');
      root.style.setProperty('--radius', (settings.radius || 0.5) + 'rem');
      var imgUrl = settings.sidebarImageUrl || 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=80';
      root.style.setProperty('--sidebar-bg-image', 'url("' + imgUrl + '")');
      root.setAttribute('data-sidebar-image-brightness', settings.sidebarImageBrightness || 'dark');
    } else {
      root.classList.add('light');
      root.setAttribute('data-font-size', 'small');
      root.setAttribute('data-font-family', 'geist');
      root.setAttribute('data-color-scheme', 'blue');
      root.setAttribute('data-sidebar-mode', 'normal');
      root.setAttribute('data-sidebar-theme', 'brand');
      root.setAttribute('data-content-mode', 'full');
      root.setAttribute('data-content-view', 'carded');
      root.style.setProperty('--radius', '0.5rem');
      root.style.setProperty('--sidebar-bg-image', 'url("https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=80")');
      root.setAttribute('data-sidebar-image-brightness', 'dark');
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
