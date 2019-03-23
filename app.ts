import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import { default as express, NextFunction, Request, Response } from "express";
// TODO: maybe import favicon from 'serve-favicon';
import * as logger from "morgan";
import * as path from "path";

import * as api from "./api";

const app = express();

// TODO: Uncomment after placing your favicon in /public
// TODO: app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

api({express, app});

type AppError = Error & {
  /** Returns any http status code associated with this error */
  status?: number;
};

const httpStatus: {[name: string]: number} = {
  INTERNAL_ERROR: 500,
  NOT_FOUND: 404,
};

// Catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  const err: AppError = new Error("Not Found");
  err.status = httpStatus.NOT_FOUND;
  next(err);
});

// Error handler
app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Render the error page
  const status = err.status || httpStatus.INTERNAL_ERROR;
  res.status(status);
  res.send(`Error ${status}`);
  res.end();
});

module.exports = app;
