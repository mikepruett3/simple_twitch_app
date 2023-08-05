// index.js

// https://www.electronforge.io/config/makers/squirrel.windows
if (require('electron-squirrel-startup')) return;

const { app, shell, session, BrowserWindow, Menu, Tray, nativeImage, dialog } = require('electron')
const { ElectronChromeExtensions } = require('electron-chrome-extensions')
require('@electron/remote/main').initialize()
const buildChromeContextMenu = require('electron-chrome-context-menu').default
const { getHA, setHA } = require('./settings.js')

// Disable Hardware Acceleration
// https://www.electronjs.org/docs/latest/tutorial/offscreen-rendering
if (!getHA()) {
    app.disableHardwareAcceleration()
}

app.on('ready', () => {
    const win = new BrowserWindow({
        width: 1280,
        height: 720,
        title: "Twitch App",
        icon: __dirname + "/images/Twitch.ico",
        session: session.defaultSession,
        autoHideMenuBar: true,
        webPreferences: {
            webviewTag: true,
            nodeIntegration: true,
            contextIsolation: false,
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

        //session.defaultSession.loadExtension(__dirname + '/extensions/BetterTTV')
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

        //let tray = null
        //const icon = nativeImage.createFromPath(__dirname + '/images/YouTube.ico')
        //tray = new Tray(icon)

        //const contextMenu = Menu.buildFromTemplate([
        //    {
        //        label: 'Hardware Acceleration',
        //        type: 'checkbox',
        //        checked: getHA(),
        //        click({ checked }) {
        //            setHA(checked)
        //            dialog.showMessageBox(
        //                null,
        //                {
        //                    type: 'info',
        //                    title: 'info',
        //                    message: 'Exiting Applicatiom, as Hardware Acceleration setting has been changed...'
        //                })
        //                .then(result => {
        //                  if (result.response === 0) {
        //                    app.relaunch();
        //                    app.exit()
        //                  }
        //                }
        //            )
        //        }
        //    },
        //    {
        //        label: 'Clear Cache',
        //        click: () => {
        //            session.defaultSession.clearStorageData()
        //            app.relaunch();
        //            app.exit();
        //        }
        //    },
        //    {
        //        label: 'Reload',
        //        click: () => win.reload()
        //    },
        //    {
        //        label: 'Quit',
        //        type: 'normal',
        //        role: 'quit'
        //    }
        //])

        //tray.setToolTip('YouTube Desktop')
        //tray.setTitle('YouTube Desktop')
        //tray.setContextMenu(contextMenu)
    })

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit()
        }
    })

    win.loadURL(`file://${__dirname}/twitch.html`)
})