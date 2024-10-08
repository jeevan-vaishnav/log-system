const http = require("http");
const logMessage = require("./logger");
const chalk = require("chalk");

const server = http.createServer((req, res) => {
  // Log the request details
  logMessage(`Request received: ${req.method} ${req.url}`);
  // Sending the response
  // Simulate different types of logs
  if (req.url === "/error") {
    logMessage(chalk.red("ERROR: Something went wrong!"));
  } else if (req.url === "/info") {
    logMessage(chalk.blue("INFO: This is an informational log."));
  } else {
    logMessage(chalk.green("SUCCESS: Request processed successfully."));
  }

  // Respond to the request
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Log System");
});

//Start the server on port 3000
const PORT = 3000;
server.listen(PORT, () => {
  console.log(chalk.green(`Server running at http://localhost:${PORT}/`));
});

// Handle shutdown gracefully
process.on("SIGINT", () => {
  console.log(chalk.red("\nServer shutting down..."));
  process.exit();
});
