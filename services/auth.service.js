import { genSaltSync, hashSync, compare } from 'bcrypt';
import { config } from 'dotenv';
import { sign, verify } from 'jsonwebtoken';

// retrieve env vars
config()

class Auth {
  constructor() {}

  static async hashPassword(pwd) {
    const saltRounds = 10;
    const salt = genSaltSync(saltRounds);
    return hashSync(pwd, salt);
  }

  static async matchPasswords(requestPwd, userPwd) {
    return compare(requestPwd, userPwd)
  }

  static generateJwt({ email, userId }) {
    return sign(
      { userId, email },
      process.env.TOKEN_SECRET,
      { expiresIn: '30 days' }
    )
  }

  static getJwtPayload(token) {
    return verify(token, process.env.TOKEN_SECRET);
  }

  static getUserId({ req = {}, authToken = '' }) {
    if (req.request?.headers) {
      const authHeader = req.request.headers.authorization
      if (authHeader) {
        const token = authHeader.replace('Bearer ', '')
        if (!token) {
          return null
        }
        const { userId } = this.getJwtPayload(token)
        return userId;
      }
    } else if (authToken) {
      const { userId } = this.getJwtPayload(authToken)
      return userId
    }
  
    return null
  }
}

export default Auth