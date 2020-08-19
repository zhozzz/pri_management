/*
 * @Description:
 * @Author: zhuhao
 * @Date: 2019-11-13 15:13:13
 * @LastEditors: zhuhao
 * @LastEditTime: 2020-03-31 11:44:51
 */
import globalUrl from "./global_url"; // 引入全局的url
import axios from "./axios_setting";
import { Message } from "element-ui";

export async function downloadFile (fileId) {
    let user = JSON.parse(localStorage.getItem("user"));
    let userId = "";
    if (user) {
        userId = user.userGuid;
    }

    await axios
        .get(globalUrl.businessUrl + "/file/checkFile/" + fileId)
        .then(res => {
            console.log(res);
            if (res) {
                location.href =
                    globalUrl.NoSSLUrl + "/file/download/" + fileId + "/" + userId;
                //   globalUrl.baseUrl + "/base/file/download/" + fileId + "/" + userId;
                return res;
            } else {
                Message.warning("文件已被删除或不存在");
            }
        });
}
