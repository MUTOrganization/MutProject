import axios from 'axios';
import { BASE_URL } from '@/config';


const fetchProtectedData = {
    /**
     * @param {String} url 
     * @param {import('axios').AxiosRequestConfig} config 
     * @returns {Promise<(import('axios').AxiosResponse)>}
     */
    get: async (url, config) => await fetchData(url, 'GET', {}, config),
    /**
     * @param {String} url 
     * @param {Object} data
     * @param {import('axios').AxiosRequestConfig} config 
     * @returns {Promise<(import('axios').AxiosResponse)>}
     */
    post: async (url, data, config) => await fetchData(url, 'POST', data, config),
    /**
     * @param {String} url 
     * @param {import('axios').AxiosRequestConfig} config 
     * @returns {Promise<(import('axios').AxiosResponse)>}
     */
    put: async (url, data, config) => await fetchData(url, 'PUT', data, config),
    /**
     * @param {String} url 
     * @param {import('axios').AxiosRequestConfig} config 
     * @returns {Promise<(import('axios').AxiosResponse)>}
     */
    delete: async (url, config) => await fetchData(url, 'DELETE', {}, config),

    
}
export default fetchProtectedData


/**
 * 
 * @param {*} url 
 * @param {import('axios').Method} method 
 * @param {*} data 
 * @param {import('axios').AxiosRequestConfig} config 
 * @returns 
 */
async function fetchData(url, method = 'GET', data = {}, config = {}, count = 0) {
  if(count >= 2) {
    throw new Error(`Can't fetchProtectedData`);
  }
  try {
    config.withCredentials = true;
    // สร้างตัวเลือกสำหรับ Axios
    const options = {
      method,
      ...config // เพิ่มตัวเลือกที่ส่งเข้ามา
    };

    // ถ้าเป็นการ POST หรือ PUT จะต้องส่ง body (data)
    if (method === 'POST' || method === 'PUT') {
      options.data = data; // เพิ่ม body เข้าไปใน options
    }

    // ส่ง request ไปยัง API ที่ต้องการเข้าถึง
    const response = await axios(url, options);

    return response; // คืนค่าข้อมูลที่ได้รับจาก API

  } catch (error) {
    if (error.response) {
      // ตรวจสอบสถานะของการตอบกลับ
      if (error.response.status === 401) {
        // accessToken หมดอายุ ทำการ refresh token
        const message = await refreshAccessToken();
        if (message) {
          // ทำการส่ง request ใหม่ด้วย accessToken ใหม่
          return fetchData(url, method, data, config, count+1); // เรียกฟังก์ชันอีกครั้ง
        }
      }
      throw error
    } else {
      throw error
    }
  }
}

async function refreshAccessToken() {
  
  try {
    const response = await axios.post(BASE_URL + '/auth/refreshToken', {}, {
        withCredentials: true
    });

    // เก็บ accessToken ใหม่
    const { message } = response.data;
    return message;

  } catch (error) {
    console.error('Error refreshing access token:', error.response?.data || error.message);
    return null;
  }
}