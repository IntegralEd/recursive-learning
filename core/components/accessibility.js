function applyAccessibilitySettings(accessibilityConfig) {
  const root = document.documentElement;

  if (accessibilityConfig.Client_A11y_Contrast_Mode) {
    root.style.setProperty('--client-text-color', '#000000');
    root.style.setProperty('--client-background-color', '#FFFFFF');
  }

  if (accessibilityConfig.Client_High_Contrast_Mode) {
    root.style.setProperty('--client-primary-color', '#000000');
    root.style.setProperty('--client-secondary-color', '#FFFFFF');
  }

  if (accessibilityConfig.Client_Font_Scale) {
    const scale = parseFloat(accessibilityConfig.Client_Font_Scale);
    root.style.setProperty('--client-font-size-body', `${16 * scale}px`);
    root.style.setProperty('--client-font-size-h1', `${32 * scale}px`);
    root.style.setProperty('--client-font-size-h2', `${24 * scale}px`);
  }
}

export { applyAccessibilitySettings }; 