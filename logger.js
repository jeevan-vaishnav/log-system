const fs = require("fs");
const { getLogFileName, shouldRotateLog } = require("./utils");
const chalk = require("chalk"); // For colorful console output

let logStream = null;

function initLogStream() {
  const logFilePath = getLogFileName();
  // Rotate if log exceeds 5MB
  if (logStream && shouldRotateLog(logFilePath)) {
      logStream.end(() => {
      console.log(chalk.blue(`Log file rotated due to size limit!`));
      initLogStream(); // Initialize new log stream after rotation
      console.log('New log created....')
    });
    return; // Exit to prevent writing to a closed stream
  }
  logStream = fs.createWriteStream(logFilePath, { flags: "a" });
  console.log(chalk.green("Logging to:"), logFilePath);
  // Add error handling for the stream
  logStream.on("error", (err) => {
    console.error(chalk.red("Log stream error:"), err);
  });
}
function logMessage(message) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}\n`;
  
    if (!logStream || !logStream.writable) {
      console.error(chalk.red("Log stream is not writable."));
      return;
    }
  
    logStream.cork(); // Start buffering
    console.log('Buffer started....')
    try {
      logStream.write(logEntry, "utf-8", (err) => {
        if (err) {
          console.error(chalk.red("Failed to write log:"), err);
        } else {
          console.log(chalk.yellow("Log written:"), logEntry.trim());
        }
      });
    } catch (err) {
      console.error(chalk.red("Error writing to log stream:"), err);
    } finally {
      console.log('finally started....')
      logStream.uncork(); // Always uncork, regardless of error
    }
  }
  

//close the stream gracefully on shutdown
process.on("exit", () => {
  if (logStream) {
    logStream.end(() => {
      console.log(chalk.blue("Stream closed gracefully."));
    });
  }
});

//Roatte logs daily
setInterval(() => {
  initLogStream();
}, 24 * 60 * 60 * 1000); // every 24 hourse

// Initialize the log stream when starting the app
initLogStream();

module.exports = logMessage;
