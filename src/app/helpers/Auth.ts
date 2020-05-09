import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import envs from '../../config/app';

export default class Auth {
  public static async hash(password: string) {
    return await bcrypt.hash(password, 12);
  }

  public static async compare(passwordString: string, passwordHash: string) {
    return await bcrypt.compare(passwordString, passwordHash);
  }

  public static jwtSign(id: string) {
    const {
      jwt: { jwtSecret, jwtExpiration },
    } = envs;
    return jwt.sign({ id }, jwtSecret, {
      expiresIn: jwtExpiration,
    });
  }

  public static async jwtVerify(token: string): Promise<object> {
    const {
      jwt: { jwtSecret },
    } = envs;
    return await new Promise((resolve, reject) => {
      if (!jwtSecret) {
        throw new Error('JWT Secret not defined in .env file!');
      }
      jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
          reject(err);
        }
        resolve(decoded);
      });
    });
  }
}
