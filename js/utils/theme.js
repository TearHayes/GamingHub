function getTheme() {
  try {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'dark'; // Default to dark theme
  } catch (error) {
    console.error('Get theme error:', error);
    return 'dark';
  }
}

function setTheme(theme) {
  try {
    localStorage.setItem('theme', theme);
    applyTheme(theme);
    return { success: true, theme };
  } catch (error) {
    console.error('Set theme error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

function applyTheme(theme) {
  try {
    document.body.className = '';
    document.body.classList.add(`${theme}-theme`);
  } catch (error) {
    console.error('Apply theme error:', error);
  }
}

function toggleTheme() {
  try {
    const currentTheme = getTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    return setTheme(newTheme);
  } catch (error) {
    console.error('Toggle theme error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}
