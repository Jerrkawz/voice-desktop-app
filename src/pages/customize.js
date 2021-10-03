(async function() {
    const { ipcRenderer } = require('electron');
    const constants = require('../constants')

    // Allow the user to hit the Escape key to close the window.
    window.addEventListener('keyup', (event) => {
        window.close();
    }, true);
    
    // Retrieve the user's settings store from the main process.
    const prefs = await ipcRenderer.invoke('get-user-prefs');
    console.log(prefs);

    // Populate the "theme" dropdown with the user's currently selected theme.
    // Notify the main process whenever the user selects a different theme.
    const themePicker = document.getElementById('theme');
    themePicker.value = (prefs.theme || constants.DEFAULT_SETTING_THEME);
    themePicker.addEventListener('change', (e) => {
        const theme = e.target.value;
        ipcRenderer.send('pref-change-theme', theme);
    });
    
    // Set the "zoom" slider to the main window's current zoom level.
    // Notify the main process whenever the user selects a new level.
    const zoomSlider = document.getElementById('zoom');
    zoomSlider.value = await ipcRenderer.invoke('get-zoom-level');
    zoomSlider.addEventListener('change', (e) => {
        const zoomLevel = e.target.value;
        ipcRenderer.send('pref-change-zoom', zoomLevel);
    });
    
    // Set the "show menu bar" checkbox based on the user's currently selected preference.
    // Notify the main process whenever the user changes their preference.
    const menubarSetting = document.getElementById('show-menubar');
    menubarSetting.checked = (prefs.showMenuBar != undefined) ? prefs.showMenuBar : constants.DEFAULT_SETTING_SHOW_MENU_BAR;
    menubarSetting.addEventListener('change', (e) => {
        const checked = e.target.checked;
        ipcRenderer.send('pref-change-show-menubar', checked);
    });
    
    // Set the "start minimized" checkbox based on the user's currently selected
    // startup mode.  Notify the main process whenever the user changes the mode.
    const minimizedSetting = document.getElementById('start-minimized');
    minimizedSetting.checked = (prefs.startMinimized != undefined) ? prefs.startMinimized : constants.DEFAULT_SETTING_START_MINIMIZED;
    minimizedSetting.addEventListener('change', (e) => {
        const checked = e.target.checked;
        ipcRenderer.send('pref-change-start-minimized', checked);
    });
})();