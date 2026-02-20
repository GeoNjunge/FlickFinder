import aj from "../Config/arcjet.js";
import type { AllRequest } from "../Utils/Types/express.d.ts";
import type { userRequest } from "../Utils/Types/UserRequest";
import { slidingWindow } from "arcjet";
import type { NextFunction, Response } from "express";
import logger from "../Config/logger.js";

export const securityMiddleware = async (
  req: AllRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const role = req.user?.role || "guest";
    let limit: number | undefined;
    let message: string | undefined;

    switch (role) {
      case "admin":
        limit = 20;
        message = "Admin request exceeded 20 per minute. Slow down";
        break;
      case "user":
        limit = 10;
        message = "User request exceeded 10 per minute. Slow down";
        break;
      case "guest":
        limit = 5;
        message = "guest request exceeded 5 per minute. Slow down";
        break;
    }

    // Implement rate limiting logic here based on the 'limit' variable
    const client = aj.withRule(
      slidingWindow({
        mode: "LIVE",
        interval: "1m",
        max: limit!,
      })
    );

    // Ensure socket.remoteAddress is a string because Arcjet's Node request type requires it
    const arcjetReq = {
      ...req,
      socket: {
        ...(req.socket ?? {}),
        remoteAddress: (req.socket?.remoteAddress ?? "") as string,
      },
    } as unknown;

    const decision = await client.protect(arcjetReq as any);

    if (decision.isDenied() && decision.reason.isBot()) {
      logger.warn("Bot request blocked", {
        ip: req.ip,
        userAgent: req.get("User-Agent"),
        path: req.path,
      });
      return res.status(403).json({
        error: "Forbidden",
        message: "Automated requests are not allowed",
      });
    }

    if (decision.isDenied() && decision.reason.isShield()) {
      logger.warn("Shield request blocked", {
        ip: req.ip,
        userAgent: req.get("User-Agent"),
        path: req.path,
      });
      return res.status(403).json({
        error: "Forbidden",
        message: "Request blocked by security policy",
      });
    }

    if (decision.isDenied() && decision.reason.isRateLimit()) {
      logger.warn("Rate limit exceeded", {
        ip: req.ip,
        userAgent: req.get("User-Agent"),
        path: req.path,
      });
      return res.status(403).json({
        error: "Forbidden",
        message: "Too many requests",
      });
    }
    next();
  } catch (error) {
    logger.error("Security middleware error", { error });
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An error occurred while processing your request",
    });
  }
};
