import { Request } from "express";
import jwt from "jsonwebtoken";

// function to generate the email token
export function generateEmailToken(req: Request, id: any) {
  const url = getFullHostURL(req);
  const current_date = new Date();
  const expiry_time = current_date.getTime() + 30 * 60 * 1000; // 30 minutes
  const email_token = jwt.sign(
    { id, expires: expiry_time },
    process.env.TOKEN_SECRET
  );
  return { url, email_token };
}
// function to generate host url
export function getFullHostURL(req: Request): String {
  const protocol = req.headers["x-forwarded-proto"] || req.protocol || "https";
  const host = req.get("host");
  return `${protocol}://${host}`;
}

// function to generate email verification url
export function generateEmailValidationUrl(req: Request, id: any): String {
  const { url, email_token } = generateEmailToken(req, id);
  return `${url}/verify/${email_token}`;
}

// function to generate invite member url

export function addMemberViaEmail(
  req: Request,
  email: any,
  forum_id: string
): String {
  const { url, email_token } = generateEmailToken(req, email);
  return `${url}/forums/invite-member/${email_token}/${forum_id}`;
}
