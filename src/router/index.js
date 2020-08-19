/*
 * @Description:
 * @Author:
 * @Date: 2019-09-10 20:23:22
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-04-27 21:35:13
 */

import Vue from 'vue'
import Router from 'vue-router'
import { Message } from 'element-ui'

Vue.use(Router)
const router = new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            name: 'login',
            // vue的异步组件加载
            component: resolve => require(['../views/login/login'], resolve)
        },
        {
            path: '/beindex',
            name: 'beindex',
            component: resolve => require(['../views/index/before_index'], resolve)
        },
        {
            path: '/index',
            name: 'index',
            redirect: 'index/workbench',
            component: resolve => require(['../views/index/index/index'], resolve),
            children: [
                // index下的子路由
                {
                    // 工作台
                    path: 'workbench',
                    name: 'workbench',
                    component: resolve =>
                        require(['../views/workbench/workbench'], resolve)
                },
                // {
                //   // 系统管理模块-菜单管理
                //   path: 'main_page',
                //   name: 'main_page',
                //   component: resolve => require(['../views/main_page'], resolve)
                // },
                {
                    // 外接页面-视频监控
                    path: 'check_video',
                    name: 'check_video',
                    component: resolve => require(['../views/check_video'], resolve)
                },
                {
                    // 系统管理模块-菜单管理
                    path: 'menu_mgt',
                    name: 'menu_mgt',
                    meta: {
                        noSide: true
                    },
                    component: resolve => require(['../views/sys_mgt/menu_mgt/'], resolve)
                },
                {
                    // 系统管理模块-类型管理
                    path: 'type_mgt',
                    name: 'type_mgt',
                    meta: {
                        noSide: true
                    },
                    component: resolve => require(['../views/sys_mgt/type_mgt'], resolve)
                },
                {
                    // 系统管理模块-班次管理
                    path: 'shift_mgt',
                    name: 'shift_mgt',
                    meta: {
                        noSide: true
                    },
                    component: resolve => require(['../views/sys_mgt/shift_mgt'], resolve)
                },
                {
                    // 系统管理模块-日程节假日管理
                    path: 'calendar_mgt',
                    name: 'calendar_mgt',
                    meta: {
                        noSide: true
                    },
                    component: resolve =>
                        require(['../views/sys_mgt/calendar_mgt'], resolve)
                },
                {
                    // 系统管理模块-权限管理
                    path: 'permission_mgt',
                    name: 'permission_mgt',
                    meta: {
                        noSide: true
                    },
                    component: resolve =>
                        require(['../views/sys_mgt/permission_mgt'], resolve)
                },
                {
                    // 系统管理模块-角色管理
                    path: 'role_mgt',
                    name: 'role_mgt',
                    meta: {
                        noSide: true
                    },
                    component: resolve =>
                        require(['../views/sys_mgt/role_mgt/role_mgt'], resolve)
                },
                {
                    // 系统管理模块-用户管理
                    path: 'user_mgt',
                    name: 'user_mgt',
                    component: resolve =>
                        require(['../views/sys_mgt/user_mgt/user_mgt'], resolve)
                },
                {
                    // 系统管理模块-阈值管理
                    path: 'threshold_mgt',
                    name: 'threshold_mgt',
                    meta: {
                        noSide: true
                    },
                    component: resolve =>
                        require(['../views/sys_mgt/threshold_mgt'], resolve)
                },
                {
                    // 系统管理模块-摄像头管理
                    path: 'camera_conf',
                    name: 'camera_conf',
                    component: resolve =>
                        require(['../views/sys_mgt/camera_conf'], resolve)
                },
                {
                    // 系统管理模块-房间管理
                    path: 'room_conf',
                    name: 'room_conf',
                    component: resolve => require(['../views/sys_mgt/room_conf'], resolve)
                },
                {
                    // 系统管理模块-5+1+1配置
                    path: 'day_setting',
                    name: 'day_setting',
                    component: resolve =>
                        require(['../views/sys_mgt/day_setting'], resolve)
                },
                {
                    // 系统管理模块-5+1+1详情
                    path: 'day_detail',
                    name: 'day_detail',
                    component: resolve =>
                        require(['../views/sys_mgt/day_setting/detail'], resolve)
                },
                {
                    // 5+51+1模块 - 罪犯劳动
                    path: 'criminal_labour',
                    name: 'criminal_labour',
                    component: resolve =>
                        require([
                            '../views/prison_management/day_setting_model/criminal_labour'
                        ], resolve)
                },
                {
                    // 5+51+1模块 - 罪犯劳动详情
                    path: 'criminal_labour_detail',
                    name: 'criminal_labour_detail',
                    component: resolve =>
                        require([
                            '../views/prison_management/day_setting_model/criminal_labour/detail'
                        ], resolve)
                },
                {
                    // 5+51+1模块 - 罪犯学习
                    path: 'criminal_study',
                    name: 'criminal_study',
                    component: resolve =>
                        require([
                            '../views/prison_management/day_setting_model/criminal_study'
                        ], resolve)
                },
                {
                    // 5+51+1模块 - 罪犯休息详情
                    path: 'criminal_rest_detail',
                    name: 'criminal_rest_detail',
                    component: resolve =>
                        require([
                            '../views/prison_management/day_setting_model/criminal_rest/detail'
                        ], resolve)
                },
                {
                    // 5+51+1模块 - 罪犯休息
                    path: 'criminal_rest',
                    name: 'criminal_rest',
                    component: resolve =>
                        require([
                            '../views/prison_management/day_setting_model/criminal_rest'
                        ], resolve)
                },
                {
                    // 5+51+1模块 - 罪犯学习详情
                    path: 'criminal_study_detail',
                    name: 'criminal_study_detail',
                    component: resolve =>
                        require([
                            '../views/prison_management/day_setting_model/criminal_study/detail'
                        ], resolve)
                },
                {
                    // 5+51+1模块 - 罪犯劳动统计
                    path: 'criminal_labour_statistics',
                    name: 'criminal_labour_statistics',
                    component: resolve =>
                        require([
                            '../views/prison_management/day_setting_model/criminal_labour_statistics'
                        ], resolve)
                },
                {
                    // 5+51+1模块 - 罪犯休息统计
                    path: 'criminal_rest_statistics',
                    name: 'criminal_rest_statistics',
                    component: resolve =>
                        require([
                            '../views/prison_management/day_setting_model/criminal_rest_statistics'
                        ], resolve)
                },
                {
                    // 5+51+1模块 - 罪犯学习统计
                    path: 'criminal_study_statistics',
                    name: 'criminal_study_statistics',
                    component: resolve =>
                        require([
                            '../views/prison_management/day_setting_model/criminal_study_statistics'
                        ], resolve)
                },
                {
                    // 监狱管理-外来车辆管理
                    path: 'car_management_check_in',
                    name: 'car_management_check_in',
                    component: resolve =>
                        require([
                            '../views/prison_management/car_management/car_check_in'
                        ], resolve)
                },
                {
                    // 监狱管理-外来车辆数据汇总
                    path: 'car_management_data_statistic',
                    name: 'car_management_data_statistic',
                    component: resolve =>
                        require([
                            '../views/prison_management/car_management/cars_statistic'
                        ], resolve)
                },

                {
                    // 监狱管理-外来人员管理
                    path: 'personnel_access_management_check_in',
                    name: 'personnel_access_management_check_in',
                    component: resolve =>
                        require([
                            '../views/prison_management/personnel_access_management/check_in'
                        ], resolve)
                },
                {
                    // 监狱管理-外来人员管理
                    path: 'personnel_access_data_statistic',
                    name: 'personnel_access_data_statistic',
                    component: resolve =>
                        require([
                            '../views/prison_management/personnel_access_management/data_statistic'
                        ], resolve)
                },
                {
                    // 监狱管理-罪犯离监
                    path: 'criminal_check_out',
                    name: 'criminal_check_out',
                    component: resolve =>
                        require([
                            '../views/prison_management/criminal_management/criminal_out_in/check_out'
                        ], resolve)
                },
                {
                    // 监狱管理-罪犯离监
                    path: 'criminal_check_in',
                    name: 'criminal_check_in',
                    component: resolve =>
                        require([
                            '../views/prison_management/criminal_management/criminal_out_in/check_in'
                        ], resolve)
                },
                {
                    // 监狱管理-罪犯入监统计
                    path: 'criminal_in_statistics',
                    name: 'criminal_in_statistics',
                    component: resolve =>
                        require([
                            '../views/prison_management/criminal_management/criminal_out_in/criminal_in_statistics'
                        ], resolve)
                },
                {
                    // 监狱管理-罪犯出监统计
                    path: 'criminal_out_statistics',
                    name: 'criminal_out_statistics',
                    component: resolve =>
                        require([
                            '../views/prison_management/criminal_management/criminal_out_in/criminal_out_statistics'
                        ], resolve)
                },
                {
                    // 监狱管理-罪犯住院
                    path: 'criminal_hospitalization',
                    name: 'criminal_hospitalization',
                    component: resolve =>
                        require([
                            '../views/prison_management/criminal_management/criminal_hospital/criminal_hospitalization'
                        ], resolve)
                },
                {
                    // 监狱管理-罪犯住院统计
                    path: 'hospitalization_statisic',
                    name: 'hospitalization_statisic',
                    meta: {
                        noSide: true
                    },
                    component: resolve =>
                        require([
                            '../views/prison_management/criminal_management/criminal_hospital/hospitalization_statisic/hospitalization_statisic'
                        ], resolve)
                },
                {
                    // 监狱管理-禁闭隔离统计
                    path: 'shutterIsolation_statistics',
                    name: 'shutterIsolation_statistics',
                    component: resolve =>
                        require([
                            '../views/prison_management/criminal_management/confinement_mgt'
                        ], resolve)
                },
                {
                    // 监狱管理-禁闭隔离地方监狱管理页面
                    path: 'confinement_mgt',
                    name: 'confinement_mgt',
                    component: resolve =>
                        require([
                            '../views/prison_management/criminal_management/confinement_mgt/management'
                        ], resolve)
                },

                {
                    // 监狱管理-重点罪犯
                    path: 'criminal_group',
                    name: 'criminal_group',
                    component: resolve =>
                        require([
                            '../views/prison_management/criminal_management/criminal_group'
                        ], resolve)
                },
                {
                    // 监狱管理-重点罪犯
                    path: 'key_criminal',
                    name: 'key_criminal',
                    component: resolve =>
                        require([
                            '../views/prison_management/criminal_management/key_criminal'
                        ], resolve)
                },

                {
                    // 监狱管理-重点罪犯-统计
                    path: 'keyCriminal_statisic',
                    name: 'keyCriminal_statisic',
                    component: resolve =>
                        require([
                            '../views/prison_management/criminal_management/key_criminal/keyCriminal_statisic/keyCriminal_statisic'
                        ], resolve)
                },
                {
                    // 组织架构管理
                    path: 'dep_mgt',
                    name: 'dep_mgt',
                    component: resolve =>
                        require(['../views/sys_mgt/dep_mgt/dep_mgt'], resolve),
                    meta: {
                        noSide: true
                    }
                },
                {
                    // 4G设备管理
                    path: 'mobile_devices_summary',
                    name: 'mobile_devices_summary',
                    component: resolve =>
                        require([
                            '../views/prison_management/mobile_devices/summary'
                        ], resolve)
                },
                {
                    // 受理来文来电管理
                    path: 'accept_communications',
                    name: 'accept_communications',
                    component: resolve =>
                        require([
                            '../views/prison_management/message_mgt/accept_communications/accept_communications'
                        ], resolve)
                },
                {
                    // 受理来文来电统计
                    path: 'message_statisic',
                    name: 'message_statisic',
                    component: resolve =>
                        require([
                            '../views/prison_management/message_mgt/message_statisic/message_statisic'
                        ], resolve)
                },
                {
                    // 监狱基本信息
                    path: 'prison_basic',
                    name: 'prison_basic',
                    meta: {
                        noSide: true
                    },
                    component: resolve =>
                        require([
                            '../views/information_monitoring/prison_basic/prison_basic'
                        ], resolve)
                },
                {
                    // 省局指挥中心基本信息
                    path: 'center_basic',
                    name: 'center_basic',
                    meta: {
                        noSide: true
                    },
                    component: resolve =>
                        require([
                            '../views/information_monitoring/center_basic/center_basic'
                        ], resolve)
                },
                {
                    // 4G设备管理 汇总页面
                    path: 'mobile_device_summary',
                    name: 'mobile_device_summary',
                    component: resolve =>
                        require([
                            '../views/prison_management/mobile_devices/summary'
                        ], resolve)
                },
                {
                    // 4G设备管理 详情页面
                    path: 'mobile_device_detail',
                    name: 'mobile_device_detail',
                    component: resolve =>
                        require([
                            '../views/prison_management/mobile_devices/detail'
                        ], resolve)
                },
                {
                    // 警察进出入
                    path: 'police_access_control_query',
                    name: 'police_access_control_query',
                    component: resolve =>
                        require([
                            '../views/prison_management/police_access_control/query_data'
                        ], resolve)
                },
                {
                    // 警察进出入
                    path: 'police_access_control_data_statistic',
                    name: 'police_access_control_data_statistic',
                    component: resolve =>
                        require([
                            '../views/prison_management/police_access_control/data_statistic'
                        ], resolve)
                },
                {
                    // 危险品管理 监狱管理
                    path: 'hazmat_management_check_in',
                    name: 'hazmat_management_check_in',
                    component: resolve =>
                        require([
                            '../views/prison_management/hazmat_management/check_in'
                        ], resolve)
                },
                {
                    // 危险品管理 监狱数据统计
                    path: 'hazmat_management_data_statistic',
                    name: 'hazmat_management_data_statistic',
                    component: resolve =>
                        require([
                            '../views/prison_management/hazmat_management/data_statistic'
                        ], resolve)
                },
                {
                    // 信息监控 要情发布
                    path: 'major_push',
                    name: 'major_push',
                    component: resolve =>
                        require(['../views/information_monitoring/major_push'], resolve)
                },
                {
                    // 信息监控 要情详情
                    path: 'major_detail',
                    name: 'major_detail',
                    component: resolve =>
                        require([
                            '../views/information_monitoring/major_push/detail'
                        ], resolve)
                },
                {
                    // 基本数据  省局统计
                    path: 'center_statisic',
                    name: 'center_statisic',
                    component: resolve =>
                        require([
                            '../views/prison_management/essential_info/center_statisic/'
                        ], resolve)
                },
                {
                    // 基本数据  省局统计
                    path: 'review_excel',
                    name: 'review_excel',
                    component: resolve =>
                        require([
                            '../views/prison_management/essential_info/center_statisic/review_excel'
                        ], resolve)
                },
                {
                    // 基本数据  监狱今日上报
                    path: 'today_reported',
                    name: 'today_reported',
                    component: resolve =>
                        require([
                            '../views/prison_management/essential_info/today_reported/'
                        ], resolve)
                },
                {
                    // 基本数据  警察基本数据管理
                    path: 'police_management',
                    name: 'police_management',
                    component: resolve =>
                        require([
                            '../views/prison_management/essential_info/police_management/police_management'
                        ], resolve)
                },
                {
                    // 基本数据  警察基本数据管理
                    path: 'criminal_manegement',
                    name: 'criminal_manegement',
                    component: resolve =>
                        require([
                            '../views/prison_management/essential_info/criminal_manegement'
                        ], resolve)
                },
                {
                    // 技防统计
                    path: 'technical_prevention_sys_summary',
                    name: 'technical_prevention_sys_summary',
                    component: resolve =>
                        require([
                            '../views/prison_management/technical_prevention_sys/summary'
                        ], resolve)
                },
                {
                    // 值班管理
                    path: 'duty_mgt',
                    name: 'duty_mgt',
                    meta: {
                        noSide: true
                    },
                    component: resolve =>
                        require(['../views/prison_management/duty_mgt/duty_mgt'], resolve)
                },
                {
                    // 值班表
                    path: 'duty_table',
                    name: 'duty_table',
                    component: resolve =>
                        require(['../views/prison_management/duty_mgt/duty_table'], resolve)
                },
                {
                    // 值班工作记录
                    path: 'duty_work_record',
                    name: 'duty_work_record',
                    component: resolve =>
                        require([
                            '../views/prison_management/duty_mgt/duty_work_record'
                        ], resolve)
                },
                {
                    // 值班工作记录
                    path: 'leader_record',
                    name: 'leader_record',
                    component: resolve =>
                        require([
                            '../views/prison_management/duty_mgt/leader_record'
                        ], resolve)
                },
                {
                    // 一日工作流程
                    path: 'allday_workflow',
                    name: 'allday_workflow',

                    component: resolve =>
                        require([
                            '../views/prison_management/allday_workflow/allday_workflow'
                        ], resolve)
                },
                {
                    // 一日工作流程
                    path: 'workflow_mgt',
                    name: 'workflow_mgt',

                    component: resolve =>
                        require([
                            '../views/prison_management/allday_workflow/workflow_mgt/workflow_mgt.vue'
                        ], resolve)
                },
                {
                    // 监狱管理-罪犯死亡
                    path: 'criminal_dead',
                    name: 'criminal_dead',
                    component: resolve =>
                        require([
                            '../views/prison_management/criminal_management/criminal_dead'
                        ], resolve)
                },
                {
                    // 监狱管理-罪犯死亡-统计
                    path: 'dead_statisic',
                    name: 'dead_statisic',
                    component: resolve =>
                        require([
                            '../views/prison_management/criminal_management/criminal_dead/dead_statisic'
                        ], resolve)
                },
                {
                    // 数据统计报表
                    path: 'template_table',
                    name: 'template_table',
                    component: resolve =>
                        require([
                            '../views/work_help/statistical_report/template_table'
                        ], resolve)
                },
                {
                    // 数据统计报表编辑
                    path: 'edit_template',
                    name: 'edit_template',
                    component: resolve =>
                        require([
                            '../views/work_help/statistical_report/edit_template'
                        ], resolve)
                },
                {
                    // 文件下发与管理
                    path: 'document_statistical',
                    name: 'document_statistical',
                    component: resolve =>
                        require([
                            '../views/work_help/document_mgt/document_statistical/'
                        ], resolve)
                },
                {
                    // 文件下发与管理-收发记录
                    path: 'receive_mgt',
                    name: 'receive_mgt',
                    component: resolve =>
                        require([
                            '../views/work_help/document_mgt/receive_mgt/receive_mgt.vue'
                        ], resolve)
                },
                {
                    // 文件下发与管理-收发记录
                    path: 'sendreceive_log',
                    name: 'sendreceive_log',
                    component: resolve =>
                        require([
                            '../views/work_help/document_mgt/sendreceive_log/'
                        ], resolve)
                },
                {
                    // 文件下发与管理-文件管理
                    path: 'files_mgt',
                    name: 'files_mgt',
                    component: resolve =>
                        require(['../views/work_help/document_mgt/files_mgt/'], resolve)
                },
                {
                    // 巡查督查
                    path: 'abnormal_report',
                    name: 'abnormal_report',
                    component: resolve =>
                        require([
                            '../views/information_monitoring/abnormal_report'
                        ], resolve)
                },
                {
                    // 巡查督查
                    path: 'abnormal_statics',
                    name: 'abnormal_statics',
                    component: resolve =>
                        require([
                            '../views/information_monitoring/abnormal_report/abnormal_statics'
                        ], resolve)
                },
                {
                    // 预案管理
                    path: 'reserve_management',
                    name: 'reserve_management',
                    component: resolve =>
                        require([
                            '../views/prison_management/contingency_plan/reserve_management/reserve'
                        ], resolve)
                },
                {
                    // 预案小组管理
                    path: 'reserve_group_management',
                    name: 'reserve_group_management',
                    component: resolve =>
                        require([
                            '../views/prison_management/contingency_plan/reserve_management/reserve_group'
                        ], resolve)
                },

                {
                    // 监管安全日报
                    path: 'safety_daily_statistic',
                    name: 'safety_daily_statistic',
                    component: resolve =>
                        require([
                            '../views/prison_management/safety_daily/daily_statistic'
                        ], resolve)
                },
                // {
                //   // 监管安全日报
                //   path: 'safety_daily_info',
                //   name: 'safety_daily_info',
                //   component: resolve =>
                //     require([
                //       '../views/prison_management/safety_daily/daily_info'
                //     ], resolve)
                // },
                {
                    // 监管安全日报
                    path: 'safety_daily_push',
                    name: 'safety_daily_push',
                    component: resolve =>
                        require([
                            '../views/prison_management/safety_daily/daily_push'
                        ], resolve)
                },
                {
                    // 监管安全日报-模板
                    path: 'safety_daily_template',
                    name: 'safety_daily_template',
                    component: resolve =>
                        require([
                            '../views/prison_management/safety_daily/daily_template'
                        ], resolve)
                },
                {
                    // 指挥中心工作考核
                    path: 'center_work',
                    name: 'center_work',
                    component: resolve =>
                        require(['../views/work_help/center_work/'], resolve)
                },
                {
                    // 监狱动态-重大活动管理统计
                    path: 'major_activities_statistics',
                    name: 'major_activities_statistics',
                    component: resolve =>
                        require([
                            '../views/prison_management/prison_dynamics/major_activities/statistics'
                        ], resolve)
                },
                {
                    // 监狱动态-重大活动管理
                    path: 'major_activities',
                    name: 'major_activities',
                    component: resolve =>
                        require([
                            '../views/prison_management/prison_dynamics/major_activities/management'
                        ], resolve)
                },
                {
                    path: 'major_activities_add',
                    name: 'major_activities_add',
                    component: resolve =>
                        require([
                            '../views/prison_management/prison_dynamics/major_activities/management/add'
                        ], resolve)
                },
                {
                    path: 'major_activities_fastadd',
                    name: 'major_activities_fastadd',
                    component: resolve =>
                        require([
                            '../views/prison_management/prison_dynamics/major_activities/management/fast_add'
                        ], resolve)
                },
                {
                    path: 'major_activities_check',
                    name: 'major_activities_check',
                    component: resolve =>
                        require([
                            '../views/prison_management/prison_dynamics/major_activities/management/check'
                        ], resolve)
                },
                {
                    path: 'major_activities_edit',
                    name: 'major_activities_edit',
                    component: resolve =>
                        require([
                            '../views/prison_management/prison_dynamics/major_activities/management/edit'
                        ], resolve)
                },
                {
                    // 应急预案管理-应急小组管理
                    path: 'emergencies_team',
                    name: 'emergencies_team',
                    component: resolve =>
                        require([
                            '../views/prison_management/contingency_plan/emergencies_team/emergencies_team.vue'
                        ], resolve)
                },
                {
                    // 应急预案管理-应急小组新增
                    path: 'add_team',
                    name: 'add_team',
                    component: resolve =>
                        require([
                            '../views/prison_management/contingency_plan/emergencies_team/add_team.vue'
                        ], resolve)
                },
                {
                    // 应急预案管理-预案库
                    path: 'plan_library',
                    name: 'plan_library',
                    component: resolve =>
                        require([
                            '../views/prison_management/contingency_plan/plan_library/plan_library.vue'
                        ], resolve)
                },
                {
                    // 音视频通话
                    path: 'av',
                    name: 'av',
                    component: resolve =>
                        require([
                            '../views/prison_management/contingency_plan/av/av.vue'
                        ], resolve)
                },
                {
                    // 音视频通话-海康
                    path: 'av_hk',
                    name: 'av_hk',
                    component: resolve =>
                        require([
                            '../views/prison_management/contingency_plan/av/av_hk.vue'
                        ], resolve)
                }, {
                    // 音视频通话-海康
                    path: 'av_hk_test',
                    name: 'av_hk_test',
                    component: resolve =>
                        require([
                            '../views/prison_management/contingency_plan/av/av_hk_test.vue'
                        ], resolve)
                },
                {
                    // 应急演练管理
                    path: 'exercise_mgt',
                    name: 'exercise_mgt',
                    component: resolve =>
                        require([
                            '../views/prison_management/contingency_plan/emergency_exercise/exercise_mgt/exercise_mgt.vue'
                        ], resolve)
                },
                {
                    // 登记应急演练
                    path: 'create_exercise',
                    name: 'create_exercise',
                    component: resolve =>
                        require([
                            '../views/prison_management/contingency_plan/emergency_exercise/exercise_mgt/create_exercise.vue'
                        ], resolve)
                },
                {
                    //  应急演练统计
                    path: 'exercise_statisic',
                    name: 'exercise_statisic',
                    component: resolve =>
                        require([
                            '../views/prison_management/contingency_plan/emergency_exercise/exercise_statisic/'
                        ], resolve)
                },
                {
                    // 监狱总体情况分析
                    path: 'prison_total_status',
                    name: 'prison_total_status',
                    component: resolve =>
                        require([
                            '../views/information_monitoring/prison_total_status/prison_total_status.vue'
                        ], resolve)
                },
                {
                    // 监狱动态-突发事件管理
                    path: 'sudden_events',
                    name: 'sudden_events',
                    component: resolve =>
                        require([
                            '../views/prison_management/prison_dynamics/sudden_events/'
                        ], resolve)
                },
                {
                    // 监狱动态-突发事件统计
                    path: 'emergency_statisic',
                    name: 'emergency_statisic',
                    component: resolve =>
                        require([
                            '../views/prison_management/prison_dynamics/sudden_events/emergency_statisic/emergency_statisic'
                        ], resolve)
                },
                {
                    // 监狱动态-突发事件指挥
                    path: 'emergency_command',
                    name: 'emergency_command',
                    component: resolve =>
                        require(['../views/emergency_command/'], resolve)
                },
                {
                    // 监狱动态-隐患排查管理
                    path: 'safety_inspection',
                    name: 'safety_inspection',
                    component: resolve =>
                        require([
                            '../views/prison_management/prison_dynamics/safety_inspection/'
                        ], resolve)
                },
                {
                    // 监狱动态-隐患排查新增
                    path: 'safety_inspection_created',
                    name: 'safety_inspection_created',
                    component: resolve =>
                        require([
                            '../views/prison_management/prison_dynamics/safety_inspection/safety_inspection_created/'
                        ], resolve)
                },
                {
                    // 监狱动态-隐患排查统计
                    path: 'safety_statisic',
                    name: 'safety_statisic',
                    component: resolve =>
                        require([
                            '../views/prison_management/prison_dynamics/safety_inspection/safety_statisic/'
                        ], resolve)
                }
            ]
        }
    ]
})

// 路由守卫判断本地是否存在token
router.beforeEach((to, from, next) => {
    if (window._axiosPromiseArr === undefined) {
        window._axiosPromiseArr = []
    }
    window._axiosPromiseArr.forEach((ele, index) => {
        // 取消上一个页面的请求并返回错误信息
        ele.cancel()
        delete window._axiosPromiseArr[index]
    })
    let token = localStorage.getItem('token') // 判断本地是否存在token
    if (to.name != 'login') {
        if (token) {
            next()
        } else {
            Message.warning('登录失效，请先登录')
            next({
                path: '/login'
            })
        }
    } else if (to.fullPath == '/' || to.name == 'login') {
        next()
    }
})

export default router
