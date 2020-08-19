/*
 * @Description:
 * @Author:
 * @Date: 2019-08-22 10:17:42

 * @LastEditors: zhuhao
 * @LastEditTime: 2020-08-19 17:17:15

 */
// 全局url






const baseUrl = "http://10.1.62.254:8769";
const NoSSLUrl = "http://10.1.62.254:8764";
const wsUrl = "ws://10.1.62.254:8764";
const videoUrl2 = "http://10.1.10.50:9999";




// 未配置证书时NoSSLUrl加上 / base


//videoUrl2不要用https 用于海康平台接口


const userUrl = baseUrl + "/user";
const businessUrl = baseUrl + "/business";
const abdoorUrl = baseUrl + "/abdoor";
const videoUrl = baseUrl + "/video";

export default {
    baseUrl,
    NoSSLUrl,
    userUrl,
    businessUrl,
    wsUrl,
    abdoorUrl,
    videoUrl,
    videoUrl2  //用于海康平台接口
};
