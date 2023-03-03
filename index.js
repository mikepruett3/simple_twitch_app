// index.js

// https://www.electronforge.io/config/makers/squirrel.windows
if (require('electron-squirrel-startup')) return;

const { app, BrowserWindow, session, shell } = require('electron')
const { ElectronChromeExtensions } = require('electron-chrome-extensions')
require('@electron/remote/main').initialize()
const buildChromeContextMenu = require('electron-chrome-context-menu').default

// Disable Hardware Acceleration
// https://www.electronjs.org/docs/latest/tutorial/offscreen-rendering
app.disableHardwareAcceleration()

app.on('ready', () => {
    const win = new BrowserWindow({
        width: 1280,
        height: 720,
        title: "Twitch App",
        icon: __dirname + "/images/Twitch.png",
        session: session.defaultSession,
        autoHideMenuBar: true,
        webPreferences: {
            webSecurity: true,
            contextIsolation: false,
            webviewTag: true,
            nodeIntegration: true,
            nativeWindowOpen: true
        },
        frame: false
    });

    require('@electron/remote/main').enable(win.webContents)

    app.on('web-contents-created', async (event, webContents) => {
        const extensions = new ElectronChromeExtensions({
            session: session.defaultSession,
            createTab(details) {
                // Optionally implemented for chrome.tabs.create support
            },
            selectTab(tab, browserWindow) {
                // Optionally implemented for chrome.tabs.update support
            },
            removeTab(tab, browserWindow) {
                // Optionally implemented for chrome.tabs.remove support
            },
            createWindow(details) {
                // Optionally implemented for chrome.windows.create support
            },
        })

        extensions.addTab(win.webContents, win)

        session.defaultSession.loadExtension(__dirname + '/extensions/BetterTTV')
        session.defaultSession.loadExtension(__dirname + '/extensions/Twitch-Loot-Collector')
        session.defaultSession.loadExtension(__dirname + '/extensions/Video-Ad-Block--for-Twitch')


        if (webContents.getType() === 'webview') {
            webContents.setWindowOpenHandler(({ url }) => {
                require('electron').shell.openExternal(url)
                return { action: 'deny' }
            })
        }

        webContents.on('context-menu', async (e, params) => {
            const menu = buildChromeContextMenu({
                params,
                webContents,
                openLink: (url, disposition) => {
                    webContents.loadURL(url)
                }
            })
            session.defaultSession.loadExtension(__dirname + '/extensions/ublock_origin', { allowFileAccess: true })
            menu.popup()
        })
    })

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') app.quit()
    })

    win.loadURL(`file://${__dirname}/twitch.html`)
})