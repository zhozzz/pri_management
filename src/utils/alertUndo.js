/*
 * @Description:
 * @Author: fzw
 * @Github:
 * @Date: 2020-01-13 18:22:0
 * @LastEditors  : zhuhao
 * @LastEditTime : 2020-01-15 14:51:43
 */
// 对一日工作流程做定时提醒

import _globalUrl from "./global_url";
import { getDeptId } from "./index";
import { formatDate } from "./date";
import { Notification, Message } from 'element-ui'
import axios from '@/utils/axios_setting'

function alertMessage (time, detail) {
    Notification({
        title: '接下来的工作事项',
        message: time + '\n' + detail,
        duration: 0
    })
}

async function fetchWorkFlow () {
    let deptId = getDeptId()
    let date = formatDate(new Date(), 'yyyy-MM-dd')
    await axios.get(_globalUrl.businessUrl + '/dayWork/queryDayWorkFlow/' + deptId + '/' + date)
        .then(res => {
            return res
        })
        .catch(() => {
            Message.info('获取今日工作流程失败')
        })
}

function getWorkFlow () {
    let workFlow = localStorage.getItem('workFlow')
    if (workFlow == null || workFlow === '') {
        workFlow = fetchWorkFlow()
        workFlow = JSON.stringify(workFlow)
        localStorage.setItem('workFlow', workFlow)
    }
    return workFlow
}

function alertUndo () {
    console.log('工作事项提醒');
    let res = null
    res = getWorkFlow()

    if (res && res != undefined) {
        let workFlow = JSON.parse(res)

        if (workFlow.length) {

            workFlow.forEach(work => {
                let currentTime = new Date()
                if (work.require === '交接班') {
                    let endTime = new Date('1970-01-01 ' + work.endTime)
                    let dis = endTime.getMinutes() - currentTime.getMinutes()
                    if (endTime.getHours() === currentTime.getHours() && ((dis > 0 && dis <= 1) || (dis <= 10 && dis > 5) || (dis <= 5 && dis > 1))) {
                        alertMessage(work.endTime, work.detail)
                    }
                } else {
                    let startTime = new Date('1970-01-01 ' + work.startTime)
                    let dis = startTime.getMinutes() - currentTime.getMinutes()
                    if (startTime.getHours() === currentTime.getHours() && ((dis > 0 && dis <= 1) || (dis <= 10 && dis > 5) || (dis <= 5 && dis > 1))) {
                        alertMessage(work.endTime, work.detail)
                    }
                }
            })
        }
    }
}

export {
    alertUndo
}
