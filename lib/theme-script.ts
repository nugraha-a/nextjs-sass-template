export const themeScript = `
(function() {
  try {
    var storageKey = 'next-sass-theme-settings';
    var stored = localStorage.getItem(storageKey);
    var root = document.documentElement;

    // Migration map: old scheme names → new scheme names
    var migrationMap = {
      'zinc': 'carbon',
      'neutral': 'slate',
      'orange': 'teal',
      'rose': 'crimson'
    };

    if (stored) {
      var settings = JSON.parse(stored);

      // Auto-remap old color schemes to new ones
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
      
      if (settings.fontSize) root.setAttribute('data-font-size', settings.fontSize);
      if (settings.fontFamily) root.setAttribute('data-font-family', settings.fontFamily);
      if (settings.colorScheme) {
        root.setAttribute('data-color-scheme', settings.colorScheme);
        document.body.setAttribute('data-color-scheme', settings.colorScheme);
      }
      if (settings.sidebarMode) root.setAttribute('data-sidebar-mode', settings.sidebarMode);
      if (settings.sidebarTheme) root.setAttribute('data-sidebar-theme', settings.sidebarTheme);
      if (settings.contentMode) root.setAttribute('data-content-mode', settings.contentMode);
      if (settings.contentView) root.setAttribute('data-content-view', settings.contentView);
      if (settings.radius) root.style.setProperty('--radius', settings.radius + 'rem');
    } else {
      root.classList.add('light');
      root.setAttribute('data-font-size', 'small');
      root.setAttribute('data-font-family', 'geist');
      root.setAttribute('data-color-scheme', 'carbon');
      root.setAttribute('data-sidebar-mode', 'normal');
      root.setAttribute('data-sidebar-theme', 'aurora');
      root.setAttribute('data-content-mode', 'full');
      root.setAttribute('data-content-view', 'carded');
      root.style.setProperty('--radius', '0.5rem');
    }
  } catch (e) {
    console.error('Failed to apply theme settings', e);
  }
})();
`;
