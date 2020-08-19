/*
 * @Description: 后台接口api
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-21 16:26:05
 * @LastEditors: fylih
 * @LastEditTime: 2019-11-08 15:06:17
 */
import _globalUrl from '@/utils/global_url'

const API = {
  GET_PRISON_VISITOR_INFO:
    _globalUrl.businessUrl +
    '/prisonVisitorInfoController/listVistorInfoBySearchOptions',
  INSERT_VISITOR_DATA:
    _globalUrl.businessUrl + '/prisonVisitorInfoController/insertVistorData',
  VISITOR_LEAVE:
    _globalUrl.businessUrl +
    '/prisonVisitorInfoController/updateVisitorLeavetime',
  GET_PRISON_VISITOR_HISTORY:
    _globalUrl.abdoorUrl + '/abDoor/listHistoryVistorInfo',
  LIST_LEAVE_VISITOR_INFO:
    _globalUrl.businessUrl + '/prisonVisitorInfoController/listLeaveVistorInfo',
  GET_TODAY_STATISTICAL_DATA:
    _globalUrl.businessUrl +
    '/prisonVisitorInfoController/getVisitorStatisticalData',
  GET_VISITOR_STAY_TIME_FOR_PERIOD:
    _globalUrl.businessUrl +
    '/prisonVisitorInfoController/getStayTimeForPeriod',
  GET_ISSUE_STATISTICAL_DATA:
    _globalUrl.businessUrl +
    '/prisonVisitorInfoController/getIssueStatisticalDataForPeriod',
  GET_BASE_DATA:
    _globalUrl.businessUrl + '/prisonVisitorInfoController/getBaseData',
  VISITOR_GET_OVER_TIME:
    _globalUrl.businessUrl + '/prisonVisitorInfoController/getOverTime',
  GET_PRISON_OUT_SIDE_CAR_INFO:
    _globalUrl.businessUrl +
    '/prisonOutsideCarInfoController/listOutsideCarInfoBySearchOptions', // 获取入监车辆
  GET_IN_PRISON_CARS:
    _globalUrl.businessUrl + '/prisonOutsideCarInfoController/getLeaveCarList',
  CAR_DEPARTURE:
    _globalUrl.businessUrl +
    '/prisonOutsideCarInfoController/updateCarLeavetime', // 离监登记
  GET_DUTY_POLICE: '/getDutyPolice',
  INSERT_CAR_CHECK_IN:
    _globalUrl.businessUrl +
    '/prisonOutsideCarInfoController/insertOutsideCarInfo', // 插入入监车辆
  GET_HISTORY_CAR_LIST: _globalUrl.abdoorUrl + '/abDoor/getHistoryCarList', // 入监车辆历史

  // _globalUrl.businessUrl +
  //   '/prisonOutsideCarInfoController/getHistoryCarList', // 入监车辆历史
  GET_OUTSIDE_CAR_STATISTICAL_DATA:
    _globalUrl.businessUrl +
    '/prisonOutsideCarInfoController/getOutsideCarStatisticalData', // 入监车辆历史统计
  GET_OVER_TIME:
    _globalUrl.businessUrl + '/prisonOutsideCarInfoController/getOverTime', // 入监车辆超时阈值
  GET_STAY_TIME_FOR_PERIOD:
    _globalUrl.businessUrl +
    '/prisonOutsideCarInfoController/getStayTimeForPeriod', // 入监车辆停放时间查询
  GET_MOBILE_DEVICE_MANAGEMENT:
    _globalUrl.businessUrl +
    '/mobileDeviceManagement/getMobileDeviceManagement', // 获取4G设备汇总列表
  INSERT_MOBILE_DEVICE:
    _globalUrl.businessUrl + '/mobileDeviceManagement/insertSelective', // 插入4G设备
  EDIT_MODILE_DEVICE:
    _globalUrl.businessUrl + '/mobileDeviceManagement/editSelective', // 4G设备编辑
  GET_MOBILE_DEVICE_MANAGEMENT_DETAIL:
    _globalUrl.businessUrl +
    '/mobileDeviceManagement/getMobileDeviceManagementDetail',
  GET_DEPARTMENT:
    _globalUrl.businessUrl + '/mobileDeviceManagement/getDropDownList', // 获取部门list
  GET_DEPT_LIST:
    _globalUrl.businessUrl + '/prisonOutsideCarInfoController/getDeptList', // 获取监区list
  GET_DVICE_TYPE:
    _globalUrl.businessUrl + '/mobileDeviceManagement/getDropDownList', // 获取4g设备类型
  UPDATE_DVICE:
    _globalUrl.businessUrl + '/mobileDeviceManagement/updDeviceInfo', // 更新4g设备
  MOBILE_DEVICE_EXPORT:
    _globalUrl.businessUrl + '/mobileDeviceManagement/export', // 4g设备导出
  GET_POLICE_ACCESS_CONTROL_LIST:
    _globalUrl.businessUrl + '/policeInoutRecord/getRecordList', // 获取警察进出管理
  GET_POLICE_DETAIL: _globalUrl.abdoorUrl + '/abDoor/getPoliceDetails', // 获取警察详情

  //  GET_POLICE_DETAIL: _globalUrl.userUrl + '/userManage/getUserById', // 获取警察详情
  GET_POLICE_ACCESS_CONTROL_SUMMARY:
    _globalUrl.businessUrl + '/policeInoutRecord/getECharsData', // 获取警察进出AB汇总S
  GET_MAJOR_INFO: _globalUrl.businessUrl + '/noticePublic/getNoticePublic', // 要情列表
  GET_GOODS_TYPE: _globalUrl.businessUrl + '/dangerousGoods/queryAllGoodsType', // 获取危险品类型
  GET_GOODS_LIST: _globalUrl.businessUrl + '/dangerousGoods/getRecordList', // 获取危险品列表
  ADD_GOODS: _globalUrl.businessUrl + '/dangerousGoods/add', // 危险品登记
  // DUTY_POLICE: _globalUrl.userUrl + '/userManage/getUserList', // 获取警察列表
  DUTY_POLICE: _globalUrl.userUrl + '/userManage/selPolice', // 获取警察列表
  GOODS_OUT: _globalUrl.businessUrl + '/dangerousGoods/update', // 危险品离监
  GET_GOODS_SUMMARY: _globalUrl.businessUrl + '/dangerousGoods/getECharsData', // 危险品汇总
  TITLE_INSERT: _globalUrl.businessUrl + '/noticePublic/insertSelective', // 插入title
  TITLE_UPDATE: _globalUrl.businessUrl + '/noticePublic/updNoticePublicInfo', // 插入title
  MAJOR_ADD_LIST: _globalUrl.baseUrl + '/base/message/addList', // 插入title推送消息
  GET_NOTICE_PUBLIC_DETAIL:
    _globalUrl.businessUrl + '/noticePublic/getNoticePublicDetail', // 插入title
  EDIT_NOTICE_PUBLIC: _globalUrl.businessUrl + '/noticePublic/editNoticePublic', // 编辑要情信息
  NOTICE_CONFIRM_INFO:
    _globalUrl.businessUrl + '/noticePublic/updNoticeConfirmInfo', // 要情信息确认
  CONFIRM_MESSAGE: _globalUrl.baseUrl + '/base/message/confirm/', // 要情信息确认
  // GET_DEPART_TREE: _globalUrl.userUrl + '/compose/getChildrenTree/', // 获取部门tree
  GET_DEPART_TREE: _globalUrl.userUrl + '/compose/getPrisonTree/', // 获取部门tree
  GET_BY_CODE: _globalUrl.userUrl + '/dictionarySubclass/byCode/', // 获取code
  UPLOAD_FILES: _globalUrl.businessUrl + '/file/uploadFiles', // 上传
  DOWNLOAD: _globalUrl.businessUrl + '/file/download/',
  GETCHILDRENTREE: _globalUrl.userUrl + '/compose/getChildrenTree/',
  GET_AB_NORMAL_REPORT_LIST: _globalUrl.businessUrl + '/prison/getList', // 获取巡查督查违规列表
  GET_REPORT_DETAIL: _globalUrl.businessUrl + '/prison/getById', // 获取违规详情
  ADD_RECTIFY: _globalUrl.businessUrl + '/prison/addRectifyDesc' // 添加整改反馈
}
export default API
