import {createVoidAnimal} from "./src/app/middleware/animals";

const DEPLOY = false

const DB_INFO_LOCAL = {
  baseUrl: 'http://localhost',
  port: 3000
}

const DB_INFO_DEPLOY = {
  baseUrl: 'http://adoptapp.servidormagico.es',//'https://backend-h03i.onrender.com',
  port: 3000
}

export const getBaseUrl = () => {
  return DEPLOY ? `${DB_INFO_DEPLOY.baseUrl}:${DB_INFO_DEPLOY.port}` : `${DB_INFO_LOCAL.baseUrl}:${DB_INFO_LOCAL.port}`
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
  private username: string = ''

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

  getUsername() {
    return this.username
  }
  setUsername(value: string) {
    this.username = value
  }

}

export let selected = {
  userUsername: '',
  animal: createVoidAnimal()
}

export const loggedUser = new LoggedUser()
