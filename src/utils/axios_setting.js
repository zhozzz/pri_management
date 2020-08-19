/*
 * @Description:
 * @Author:
 * @Date: 2019-08-31 17:28:30
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-04-25 13:54:48
 */

// 引入axios以及element ui中的loading
import axios from 'axios'
import router from '../router'
import { Loading, Message } from 'element-ui'

//  超时时间
const service = axios.create({
    timeout: 60000 // request timeout
    // headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
})
//  http请求拦截器
function startLoading () {
    // 使用Element loading-start 方法
    Loading.service({
        lock: true,
        text: '加载中……',
        background: 'rgba(0, 0, 0, 0.7)'
    })
}

function endLoading () {
    // 使用Element loading-close 方法
    Loading.service().close()
}

function goto (url) {
    router.replace({
        path: url,
        query: {
            // eslint-disable-next-line no-undef
            redirect: router.currentRoute.fullPath
        } // 将跳转的路由path作为参数，登录成功后跳转到该路由
    })
}
// 定义请求的数组
window._axiosPromiseArr = []
// axios请求拦截器
axios.interceptors.request.use(
    config => {
        // 调用axios的cencel方法将当前页面发送的请求并为数组放到window实例
        config.cancelToken = new axios.CancelToken(cancel => {
            window._axiosPromiseArr.push({ cancel })
        })
        // 如果有token信息，请求头部添加token
        let myToken = localStorage.getItem('token')
        if (myToken) {
            config.headers.token = myToken
        }
        // startLoading()
        return config
    },
    error => {
        // endLoading()
        Message.error({
            message: '加载超时'
        })
        return Promise.reject(error)
    }
)
//  http响应拦截器
axios.interceptors.response.use(
    data => {
        // endLoading()
        // 响应成功关闭loading

        // console.log('数据返回=>')
        // console.log(data)
        if (data.config.responseType === 'arraybuffer') {
            // 附件返回 blob  数据
            return data
        }
        if (data.config.responseType === 'blob') {
            // 附件返回 blob  数据
            return data
        }
        if (data.headers['content-type'] === 'application/octet-stream') {
            // 附件返回 blob  数据
            return data
        }
        switch (data.data.status) {
            // 成功获取数据，那么返回数据
            case 0:
                return data.data.data
            case 1:
                // Message.error({
                //     message: data.data.msg
                // })
                // goto('/login')
                return Promise.reject(data)
            // 数据获取失败，且状态码为登录相关的特殊状态码，返回后端错误信息，跳转到登录页
            case 3:
                Message.error({
                    message: data.data.msg
                })
                // eslint-disable-next-line no-undef
                goto('/login')
                return Promise.reject(data)
            case 999:
                // console.log('case 999')
                // Message.warning({
                //     message: data.data.msg
                // })
                // 阻断
                return Promise.reject(data)
            // 数据获取失败，状态码为非特殊状态码，返回后端错误信息
            default:
                Message.error({
                    message: data.data.msg
                })
                return Promise.reject(data)
        }
    },
    error => {
        // 响应失败，根据状态码由前端返回错误信息
        console.log(error)

        // endLoading()
        if (error && error.response) {
            switch (error.response.status) {
                case 400:
                    error.message = '错误请求'
                    Message.error('错误请求')
                    break
                case 401:
                    error.message = '未授权，请重新登录'
                    Message.error('未授权，请重新登录')
                    break
                case 403:
                    error.message = '拒绝访问'
                    Message.error('拒绝访问')
                    break
                case 404:
                    error.message = '请求错误,未找到该资源'
                    Message.error('请求错误,未找到该资源')
                    break
                case 405:
                    error.message = '请求方法未允许'
                    Message.error('请求方法未允许')
                    break
                case 408:
                    error.message = '请求超时'
                    Message.error('请求超时')
                    break
                case 500:
                    console.log(error.response);

                    if (error.response.data.message == 'GENERAL') {
                        error.message = '服务器端出错'
                        Message.error('服务器端出错')
                    } else {

                        Message.error(error.response.data)
                    }
                    break
                case 501:
                    error.message = '网络未实现'
                    Message.error('网络未实现')
                    break
                case 502:
                    error.message = '网络错误'
                    Message.error('网络错误')
                    break
                case 503:
                    error.message = '服务不可用'
                    Message.error('服务不可用')
                    break
                case 504:
                    error.message = '网络超时'
                    Message.error('网络超时')
                    break
                case 505:
                    error.message = 'http版本不支持该请求'
                    Message.error('http版本不支持该请求')
                    break
                default:
                    error.message = `连接错误${error.response.status}`
                    Message.error(`'连接错误'${error.response.status}`)
            }
        } else if (!error.response) {
            //   console.log(axios.isCancel(error))
            //   是否因页面跳转取消
            if (axios.isCancel(error)) {
            } else {
                error.message = '连接到服务器失败'
                Message.error('连接到服务器失败')
            }
        }
        return Promise.reject(error.message)
    }
)
export default axios
