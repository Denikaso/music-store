import axios from 'axios'
import { API_URL } from './apiConfig.js'

const apiClient = axios.create({
  baseURL: API_URL
})

export default apiClient
