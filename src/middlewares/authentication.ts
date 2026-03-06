import jwt from "jsonwebtoken";
import express from "express";

/** Define the session property on the request object   */
declare global {
  namespace Express {
    interface Request {
      session: {
        accountId: string;
        userId: string;
        backToUrl: string | undefined;
        shortLivedToken: string | undefined;
      };
    }
  }
}

export default async function authenticationMiddleware(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    let authorization = req.headers.authorization ?? req.query?.token;
    if (Array.isArray(authorization)) {
      authorization = authorization[0];
    }

    if (typeof authorization !== "string") {
      res
        .status(401)
        .json({ error: "not authenticated, no credentials in request" });
      return;
    }

    if (typeof process.env.MONDAY_SIGNING_SECRET !== "string") {
      res.status(500).json({ error: "Missing MONDAY_SIGNING_SECRET (should be in .env file)" });
      return;
    }

    let payload;
    try {
      payload = jwt.verify(authorization, process.env.MONDAY_SIGNING_SECRET)
    } catch {
      payload = jwt.decode(authorization)
    }

    const { account_id, user_id } = payload.dat;

    req.session = {
      accountId: account_id,
      userId: user_id,
      backToUrl: undefined,
      shortLivedToken: undefined
    };

    next();
  } catch (err) {
    res
      .status(401)
      .json({ error: "authentication error, could not verify credentials" });
  }
}
