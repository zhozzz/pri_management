/*
 * @Description: 返回对应警察进出的监狱或省局
 * @Author: wentoo
 * @Github:
 * @Date: 2019-09-04 18:05:40
 * @LastEditors: wentoo
 * @LastEditTime: 2019-09-05 13:29:30
 */

import prison from './query_data'
import root from './data_statistic'
import deptLayout from '@/components/deptLayout/index'
export default deptLayout({ prison, root })
