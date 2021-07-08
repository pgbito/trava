
const { app, BrowserWindow } = require('electron')
app.whenReady().then(() => {
   // Create the browser window.
   const mainWindow = new BrowserWindow({title: "Trava", toolbar: false,width: 800, height: 600,  resizable: false, webPreferences: {  preload: require('path').join(__dirname, 'preload.js')
    }
  })

  mainWindow.loadFile('index.html')

  app.on('activate', function () {

    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})


app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
