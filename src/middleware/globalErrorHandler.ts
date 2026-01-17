import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let statusCode = 500;
  let errorMessage = "Internel Server Error";
  let errorDetails = err;

  // PrismaClientValidationError
  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    errorMessage = "You provide incorrect field type or missing fields";
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      statusCode = 404;
      errorMessage = "Post not found. It may have already been deleted.";
    } else if (err.code === "P2002") {
      statusCode = 409;
      errorMessage = "Duplicate value detected. This record already exists.";
    } else if (err.code === "P2003") {
      statusCode = 400;
      errorMessage = "Invalid reference. Related record does not exist.";
    } else if (err.code === "P2000") {
      statusCode = 400;
      errorMessage = "Input value is too long for this field.";
    } else if (err.code === "P2011") {
      statusCode = 400;
      errorMessage = "Required field is missing or contains null value.";
    } else if (err.code === "P2014") {
      statusCode = 400;
      errorMessage =
        "Invalid relation. This operation violates a required relation.";
    } else if (err.code === "P2016") {
      statusCode = 400;
      errorMessage = "Query interpretation error. Please check request data.";
    } else if (err.code === "P2034") {
      statusCode = 409;
      errorMessage =
        "Transaction failed due to a write conflict. Please try again.";
    } else {
      statusCode = 500;
      errorMessage = "Something went wrong. Please try again later.";
    }
  } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    console.error("Prisma Unknown Error:", err);
    statusCode = 500;
    errorMessage =
      "Unexpected database error occurred. Please try again later.";
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    console.error("Prisma Initialization Error:", err);
    statusCode = 500;
    errorMessage =
      "Database service is temporarily unavailable. Please try again later.";
  }
  

  res.status(statusCode);
  res.json({
    message: errorMessage,
    err: errorDetails,
  });
}

export default errorHandler;
