import axios from 'axios'
import Qs from 'qs'

// 创建axios实例
let service = axios.create({
    baseURL: 'http://10.208.202.159:3000/',
    timeout: 10000, // 请求超时时间

})

// request拦截器
service.interceptors.request.use((config) => {
    config.data = Qs.stringify(config.data);
    config.headers["Content-Type"] = 'application/x-www-form-urlencoded;charset=utf-8'
    return config
}, (error) => {
    console.log(error) // for debug
    return Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
    (response) => {
        // let res = response.data; //修改
        return Promise.resolve(response.data)
        // return response.data
    }, (error) => {
        return Promise.reject(error)
    }
)
export default service


