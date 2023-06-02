const path = require("path")
const { app, BrowserWindow, ipcMain } = require("electron")

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    })
    win.loadFile("index.html")
}

app.whenReady().then(() => {
    ipcMain.handle('ping', () => {
        return "pong"
    })
    ipcMain.handle('square', (event, arg1) => {
        console.log("received argument: ", arg1)
        return arg1 * arg1
    })
    createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform != "darwin") {
        app.quit()
    }
})