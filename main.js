// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')
const path = require('path')

const loadTree = require("./app/browser/tree")
const drawTree = require("./app/draw/draw")

const url = process.env["URL"] || "https://github.com/dorinoltean/reverse-wireframe"

async function createWindows() {
  // Create the browser window.
  const browserWindow = new BrowserWindow({
    width: 1250,
    height: 1800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  browserWindow.loadURL(url)

  // create the drawing window
  const drawWindow = new BrowserWindow({
    width: 1260,
    height: 1800,
  })
  drawWindow.loadFile("./canvas.html")

  app.once('ready-to-show', () => {
    browserWindow.show()
    drawWindow.show()
  })
  browserWindow.webContents.on("dom-ready", async function (ctx) {
    let data = await loadTree(browserWindow.webContents)
    await drawTree(drawWindow.webContents, data)
  })

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindows)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindows()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
