import axios from 'axios'

type Me = {
  accessToken: string
  username: string
}

export default async function fetchMe(): Promise<Me> {
  const response = await axios.get('/api/v1/auth/me')
  return response.data as Me
}
