import { io } from 'socket.io_client'

const URL = 'http://localhost:3000'

export const socket = io(URL) 