// main.js

// https://www.electronforge.io/config/makers/squirrel.windows
if (require('electron-squirrel-startup')) return;

const { app, session, BrowserWindow, Menu, Tray, nativeImage, dialog } = require('electron')
const { getHA, setHA } = require('./settings.js');

const BetterTTVPath = require("path").join(__dirname, "extensions/BetterTTV/betterttv.js")
const stylingPath = require("path").join(__dirname, "style/override.css")
//const TwitchLootCollector = require("path").join(__dirname, "extensions/Twitch-Loot-Collector")

// Disable Hardware Acceleration
// https://www.electronjs.org/docs/latest/tutorial/offscreen-rendering
if (!getHA()) {
    app.disableHardwareAcceleration()
}

const createWindow = () => {
    const window = new BrowserWindow({
        width: 1280,
        height: 720,
        title: "Twitch App",
        icon: __dirname + '/images/Twitch.png',
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
            contextIsolation: false,
            webviewTag: true,
            nativeWindowOpen: true
        }
  })

    window.webContents.on("will-navigate", (event, url) => {
        if (url.indexOf("https://www.twitch.tv") !== 0) {
          event.preventDefault()
        }
    })

    window.webContents.on("did-navigate", (event, url) => {
        if (url.indexOf("https://www.twitch.tv") !== 0) return
        window.webContents.executeJavaScript(
            `(function() {
              const head = document.getElementsByTagName('head')[0]
              const script = document.createElement('script')
              script.type = 'text/javascript'
              script.src = 'file://${BetterTTVPath}'
              head.appendChild(script)
              const link = document.createElement('link')
              link.rel = 'stylesheet'
              link.href = 'file://${stylingPath}'
               head.appendChild(link)
            })()`,
            true,
        )
    })

    //window.webContents.session.loadExtension(TwitchLootCollector);

    window.loadURL("https://www.twitch.tv/directory/following")
    window.once("ready-to-show", () => {
        window.show()
    })

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

    let tray = null
    if (process.platform == 'darwin') {
        const icon = nativeImage.createFromPath(__dirname + '/images/Twitch.icns')
        tray = new Tray(icon)
    } else if (process.platform == 'win32') {
        const icon = nativeImage.createFromPath(__dirname + '/images/Twitch.ico')
        tray = new Tray(icon)
    } else if (process.platform == 'linux') {
        const icon = nativeImage.createFromPath(__dirname + '/images/Twitch.png')
        tray = new Tray(icon)
    }

    tray.setToolTip('Twitch App')
    tray.setTitle('Twitch App')
    tray.setContextMenu(contextMenu)
}

app.whenReady().then(() => {
    createWindow()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
