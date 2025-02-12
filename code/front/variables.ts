
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

let auth = false
export const isAuth = () => { return auth }
export const setAuth = (value: boolean) => { auth = value }
