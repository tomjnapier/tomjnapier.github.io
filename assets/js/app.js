import ThemeSwitcher from './theme-switcher.js'

document.addEventListener('DOMContentLoaded', function(){
  const themeSwitcher = new ThemeSwitcher();
  themeSwitcher.init()
});

document.querySelectorAll('.highlight pre').forEach(function(pre) {
    pre.setAttribute('tabindex', '0');
});