import {readTheme} from "../Functions/read-write-theme.js";

const auto_theme = await readTheme();

if (auto_theme === 'dark') {
    document.documentElement.setAttribute('theme', 'light');
} else if (auto_theme === 'light') {
    document.documentElement.setAttribute('theme', 'dark');
}