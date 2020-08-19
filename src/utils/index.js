/*
 * @Description:
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-22 17:27:28
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-02-24 15:12:17
 */
/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce (func, wait, immediate) {
    let timeout, args, context, timestamp, result;

    const later = function () {
        // 据上一次触发时间间隔
        const last = +new Date() - timestamp;

        // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
        if (last < wait && last > 0) {
            timeout = setTimeout(later, wait - last);
        } else {
            timeout = null;
            // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
            if (!immediate) {
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            }
        }
    };

    return function (...args) {
        context = this;
        timestamp = +new Date();
        const callNow = immediate && !timeout;
        // 如果延时不存在，重新设定延时
        if (!timeout) timeout = setTimeout(later, wait);
        if (callNow) {
            result = func.apply(context, args);
            context = args = null;
        }

        return result;
    };
}
export function download (result) {
    const content = result.data;
    console.log(result);

    const blob = new Blob([content], { type: result.headers["content-type"] });
    if (window.navigator.msSaveOrOpenBlob) {
        // IE10+ 缺少文件名
        navigator.msSaveBlob(blob);
    } else {
        window.location.href = URL.createObjectURL(blob);
    }
    // if (window.navigator.msSaveOrOpenBlob) {
    //   // IE10+
    //   navigator.msSaveBlob(blob)
    // } else {
    //   // 非IE下载
    //   const elink = document.createElement('a')
    //   elink.download = decodeURI(filename)
    //   elink.style.display = 'none'
    //   elink.href = URL.createObjectURL(blob)
    //   document.body.appendChild(elink)
    //   elink.click()
    //   URL.revokeObjectURL(elink.href) // 释放URL 对象
    //   document.body.removeChild(elink)
    // }
}
export function getUserId () {
    let user = JSON.parse(localStorage.getItem("user"));
    let userId = "";
    if (user) {
        userId = user.userGuid;
    }
    return userId;
}
export function getPrisonId () {
    let user = JSON.parse(localStorage.getItem("user"));
    let prisonId = "";
    if (user) {
        prisonId = user.prisonId;
    }
    return prisonId;
}
export function getDeptId () {
    let user = JSON.parse(localStorage.getItem("user"));
    let deptId = "";
    if (user) {
        deptId = user.deptGuid;
    }
    return deptId;
}
export function getDeptType () {
    let user = JSON.parse(localStorage.getItem("user"));
    let deptType = "";
    if (user) {
        deptType = user.deptType;
    }
    return deptType;
}
export function getDeptName () {
    let user = JSON.parse(localStorage.getItem("user"));
    let deptType = "";
    if (user) {
        deptType = user.deptName;
    }
    return deptType;
}
export function clearChildren (arr, childName) {
    if (arr[childName].length === 0) {
        delete arr[childName];
    } else {
        arr[childName].map(item => {
            clearChildren(item, childName);
        });
    }
}
