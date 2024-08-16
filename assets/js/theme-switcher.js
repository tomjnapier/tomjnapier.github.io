class ThemeSwitcher {
  constructor() {

    // Get nodes that will be used later
    this.nodeList = {
      rootElement: document.documentElement,
      toggle     : document.getElementById('site-theme-switcher'),
      optionsMenu: document.getElementById('site-theme-switcher-options'),
      options    : document.querySelectorAll('[data-theme]')
    }

    // The main setting that will be updated
    this.settingID = 'site-theme' 

  }
    
  // Start!
  init() {
    this.setInitialState()
    this.watchForSystemSettingChanges()
    this.bindUIActions()
  }

  // Get the theme preference from local storage
  getLocalSetting() {
    return localStorage.getItem(this.settingID);
  }

  // Set the theme preference in local storage
  setLocalSetting( value = '' ) {
  
    if ( '' == value )
      return;
  
    localStorage.setItem(this.settingID, value)

  }

  // Theme preferences are stored locally. 
  // Check there first to set the theme.
  setInitialState() {

    // Retrieve existing theme from localStorage
    let previous = localStorage.getItem('site-theme')
    let theme = ( "null" === previous || null === previous || "" === previous )? 'dark' : previous; 
    this.changeTheme(theme);

  }

  // The desired theme can follow system preferences.
  // Update the theme when the system setting changes.
  watchForSystemSettingChanges() {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', ({ matches }) => {
      let theme = (matches) ? "dark" : "light";
      this.changeTheme(theme);
    });
  }

  // Do stuff when the UI is interacted with
  bindUIActions() {

    const toggle  = this.nodeList.toggle;
    const options = this.nodeList.options;

    // Open and close the options menu
    toggle.addEventListener('click', () => {
      this.toggleOptionsMenu()
    })

    // Close the options menu on escape
    window.addEventListener('keydown', (event) => {
      if (event.code === 'Escape') {
        this.toggleOptionsMenu( true )
      }
    })

    // Select options from the menu
    options.forEach(option => {
      option.addEventListener('click', () => {
        const theme = option.dataset.theme;
        this.changeTheme(theme)
        this.setLocalSetting(theme)
      })
    })

  }

  // Toggle open the options menu
  toggleOptionsMenu( close = false ) {

    const toggle = this.nodeList.toggle;
    const optionsMenu = this.nodeList.optionsMenu;

    // If we're explicitly closing, do that, otherwise toggle state
    if ( close ) {
      optionsMenu.classList.remove('site-theme-switcher__options--active')
      toggle.classList.remove('site-theme-switcher__toggle--active')
      toggle.ariaExpanded = 'false'
    } else {
      optionsMenu.classList.toggle('site-theme-switcher__options--active')
      toggle.classList.toggle('site-theme-switcher__toggle--active')
      toggle.ariaExpanded = toggle.ariaExpanded !== 'true'
    }

  }

  changeTheme(theme = '') {

    if ('' === theme)
      return;

    const html = this.nodeList.rootElement
      
    // If the follow system theme option has been selected and media queries are supported
    if (theme === "system" && window.matchMedia) {

      if (window.matchMedia('(prefers-color-scheme: dark)').matches && (!localStorage.siteTheme || localStorage.siteTheme === "system")) {
        theme = "dark";
      }
      if (window.matchMedia('(prefers-color-scheme: light)').matches && (!localStorage.siteTheme || localStorage.siteTheme === "system")) {
        theme = "light";
      }

    }

    html.classList.remove('theme--light', 'theme--dark');
    html.classList.add('theme--' + theme);
  }

}

export default ThemeSwitcher