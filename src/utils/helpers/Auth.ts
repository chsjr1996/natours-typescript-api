import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import envs from '../envs';

export default class Auth {
  public static async hash(password: string) {
    return await bcrypt.hash(password, 12);
  }

  public static async compare(passwordString: string, passwordHash: string) {
    return await bcrypt.compare(passwordString, passwordHash);
  }

  public static jwtSign(id: string) {
    if (!envs.jwtSecret) {
      throw new Error('JWT Secret not defined in .env file!');
    }
    return jwt.sign({ id }, envs.jwtSecret, {
      expiresIn: envs.jwtExpiration,
    });
  }

  public static async jwtVerify(token: string): Promise<object> {
    return await new Promise((resolve, reject) => {
      if (!envs.jwtSecret) {
        throw new Error('JWT Secret not defined in .env file!');
      }
      jwt.verify(token, envs.jwtSecret, (err, decoded) => {
        if (err) {
          reject(err);
        }
        resolve(decoded);
      });
    });
  }
}
