import { createLogger, format, transports } from "winston";

const logger = createLogger({
  level: "info",
  format: format.combine(
 
    format.colorize(),
    format.printf(({ level, message, timestamp }) => {
      return `${level} : ${JSON.stringify(message)}`;
    })
  ),
  transports: [
    new transports.Console()
  ],
});

export default logger;
