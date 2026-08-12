import { randomBytes, scrypt as nodeScrypt, timingSafeEqual } from "node:crypto";

const KEY_LENGTH = 64;
const SCRYPT_OPTIONS = { N: 16_384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };

function scrypt(password: string, salt: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    nodeScrypt(password, salt, KEY_LENGTH, SCRYPT_OPTIONS, (error, key) => {
      if (error) reject(error);
      else resolve(key);
    });
  });
}

export async function hashAdminPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("base64url");
  const key = await scrypt(password, salt);
  return `scrypt$${salt}$${key.toString("base64url")}`;
}

export async function verifyAdminPassword(password: string, encoded: string): Promise<boolean> {
  const [algorithm, salt, keyText] = encoded.split("$");
  if (algorithm !== "scrypt" || !salt || !keyText) return false;
  const expected = Buffer.from(keyText, "base64url");
  if (expected.length !== KEY_LENGTH) return false;
  const actual = await scrypt(password, salt);
  return timingSafeEqual(actual, expected);
}
