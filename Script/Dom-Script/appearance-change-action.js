// -------------------------------
// Night/Light Theme Change Action
// -------------------------------
function toggleTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.setAttribute('theme', 'light');
    } else if (theme === 'light') {
        document.documentElement.setAttribute('theme', 'dark');
    }
}

toggleTheme('dark');