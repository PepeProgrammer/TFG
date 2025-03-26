export interface Request {
  id: number
  applicant: {
    id: number,
    username: string,
    profileImage: string
  }
  animal: {
    id: number,
    name: string
  }
  type: RequestType,
  createdAt: string
}

export enum RequestType {
  NONE = 0,
  ADOPTION = 1,
  HOST = 2,
  SPONSOR = 3,
  WANT_HOST = 4,
  REJECTED_ADOPTION = 5,
  REJECTED_HOST = 6,
  REJECTED_SPONSOR = 7

}


export const castToRequests = (data: any[]) => {
  const requests: Request[] = []
  if (data.length > 0) {
    data.forEach((request) => {
      requests.push({
        id: request.id,
        applicant: {
          id: request.user.id,
          username: request.user.username,
          profileImage: request.user.profile_image
        },
        animal: {
          id: request.animal.id,
          name: request.animal.name
        },
        type: request.type,
        createdAt: calcDays(request.createdAt)
      })
    })
  }

  return requests
}

const calcDays = (date: string) => {
  const now = new Date()
  const createdAt = new Date(date)
  const diff = now.getTime() - createdAt.getTime()
  let letter = 'w'
  let time = Math.floor(diff / (1000 * 60 * 60 * 24 * 7)) // weeks
  if(time === 0) {
    time = Math.floor(diff / (1000 * 60 * 60 * 24)) // days
    letter = 'd'
    if (time === 0) {
      time = Math.floor(diff / (1000 * 60 * 60)) // hours
      letter = 'h'
      if (time === 0) {
        time = Math.floor(diff / (1000 * 60)) // minutes
        letter = 'm'
      }
    }
  }

  return`${time}${letter}`
}
