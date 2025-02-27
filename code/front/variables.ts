const DEPLOY = false

const DB_INFO_LOCAL = {
  baseUrl: 'http://localhost',
  port: 3000
}

const DB_INFO_DEPLOY = {
  baseUrl: 'https://backend-h03i.onrender.com',
  port: 3000
}

export const getBaseUrl = () => {
  return DEPLOY ? `${DB_INFO_DEPLOY.baseUrl}` : `${DB_INFO_LOCAL.baseUrl}:${DB_INFO_LOCAL.port}`
}

export enum UserTypes {
  STANDARD = 'standard',
  ASSOCIATION = 'association',
  MODERATOR = 'moderator',
  ADMIN = 'admin',
  NO_REGISTERED = 'noRegister',
  NONE = 'none'
}

class LoggedUser {
  private auth = false
  private type: UserTypes = UserTypes.NONE

  isAuth() {
    return this.auth
  }

  setAuth(value: boolean) {
    this.auth = value
  }

  getType() {
    return this.type
  }
  setType(value: UserTypes) {
    this.type = value
  }

}

export const loggedUser = new LoggedUser()
