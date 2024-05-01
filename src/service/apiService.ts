import axios from 'axios'
import { API_URL } from './apiConfig.ts'

const apiClient = axios.create({
  baseURL: API_URL
})

export default apiClient
