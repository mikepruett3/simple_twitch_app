// main.js

// https://www.electronforge.io/config/makers/squirrel.windows
if (require('electron-squirrel-startup')) return;

const { app, session, BrowserWindow, Menu, Tray, nativeImage, dialog } = require('electron')
const { getHA, setHA } = require('./settings.js');

// Disable Hardware Acceleration
// https://www.electronjs.org/docs/latest/tutorial/offscreen-rendering
if (!getHA()) {
    app.disableHardwareAcceleration()
}

createWindow = () => {
    const win = new BrowserWindow({
        width: 1280,
        height: 720,
        title: "Twitch App",
        icon: __dirname + '/images/Twitch.ico',
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: true,
            contextIsolation: false,
            webviewTag: true,
            nativeWindowOpen: true
        }
    })

    win.loadURL('https://www.twitch.tv')

    const ses = win.webContents.session
    ses.loadExtension(__dirname.split("app.asar")[0] + '\\extensions\\Twitch-Loot-Collector')
    ses.loadExtension(__dirname.split("app.asar")[0] + '.\\extensions\\BetterTTV')
    //ses.loadExtension(__dirname.split("app.asar")[0] + '\\extensions\\ublock_origin', { allowFileAccess: true })
    //ses.loadExtension(__dirname.split("app.asar")[0] + '\\extensions\\Video-Ad-Block--for-Twitch')

    const icon = nativeImage.createFromPath(__dirname + '/images/Twitch.ico')
    const tray = new Tray(icon)

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Hardware Acceleration',
            type: 'checkbox',
            checked: getHA(),
            click({ checked }) {
                setHA(checked)
                dialog.showMessageBox(
                    null,
                    {
                        type: 'info',
                        title: 'info',
                        message: 'Exiting Applicatiom, as Hardware Acceleration setting has been changed...'
                    })
                    .then(result => {
                      if (result.response === 0) {
                        app.relaunch();
                        app.exit()
                      }
                    }
                )
            }
        },
        {
            label: 'Clear Cache',
            click: () => {
                session.defaultSession.clearStorageData()
                app.relaunch();
                app.exit();
            }
        },
        {
            label: 'Reload',
            click: () => win.reload()
        },
        {
            label: 'Quit',
            type: 'normal',
            role: 'quit'
        }
    ])

    tray.setToolTip('Twitch App')
    tray.setTitle('Twitch App')
    tray.setContextMenu(contextMenu)
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})