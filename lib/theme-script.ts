export const themeScript = `
(function() {
  try {
    const storageKey = 'aurora-theme-settings';
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const settings = JSON.parse(stored);
      const root = document.documentElement;
      
      if (settings.themeMode === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
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
      if (settings.contentMode) root.setAttribute('data-content-mode', settings.contentMode);
    }
  } catch (e) {
    console.error('Failed to apply theme settings', e);
  }
})();
`;
