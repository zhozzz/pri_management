/*
 * @Description: 表单验证
 * @Author: fylih
 * @Date: 2019-08-29 14:34:04
 * @LastEditors: fylih
 */

// 未做非空验证，因为考虑有非必填项，所以必填项需自行在页面添加required

var special = new RegExp(
  // eslint-disable-next-line no-useless-escape
  /[`~!@#$%^&*()_\-+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*（）——\|《》？：“”【】、；‘’，。、]/
)
var blank = new RegExp(/^\S*$/)

var phone = new RegExp(/^[1][3,4,5,7,8,9][0-9]{9}$/)

var name = new RegExp(/^[\u4e00-\u9fa5]+$/)

var IDCard = new RegExp(
  /^[1-9][0-7]\d{4}((19\d{2}(0[13-9]|1[012])(0[1-9]|[12]\d|30))|(19\d{2}(0[13578]|1[02])31)|(19\d{2}02(0[1-9]|1\d|2[0-8]))|(19([13579][26]|[2468][048]|0[48])0229))\d{3}(\d|X|x)?$/
)
// 中文
var chinese = new RegExp(/^[^\u4e00-\u9fa5]+$/)

var noNumber = new RegExp(/\d+/)
// normal不能为空不能包含特殊字符不能有空格
var expnoraml = params => {
  var normal = (rule, value, callback) => {
    if (value) {
      if (special.test(value)) {
        return callback(new Error(params + '不能包含特殊字符'))
      } else if (!blank.test(value)) {
        return callback(new Error(params + '不能包含空格'))
      } else {
        callback()
      }
    } else {
      callback()
    }
  }
  return normal
}

// 中文用户名类型，不能包含数字
var Isname = (rule, value, callback) => {
  if (value) {
    if (special.test(value)) {
      return callback(new Error('姓名不能包含特殊字符'))
    } else if (!blank.test(value)) {
      return callback(new Error('姓名不能包含空格'))
    } else if (!name.test(value)) {
      return callback(new Error('姓名不能包含数字或者字母'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}
// 可以英文用户名类型，不能包含数字
var isEnName = (rule, value, callback) => {
  if (value) {
    if (special.test(value)) {
      return callback(new Error('姓名不能包含特殊字符'))
    } else if (!blank.test(value)) {
      return callback(new Error('姓名不能包含空格'))
    } else if (noNumber.test(value)) {
      return callback(new Error('姓名不能包含数字'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}
// number只能为整数字，不能有空格
var number = (rule, value, callback) => {
  if (value) {
    if (!blank.test(value)) {
      return callback(new Error('字符不能包含空格'))
    } else if (!Number.isInteger(Number(value))) {
      return callback(new Error('请输入数字'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}
// 身份证验证
var isIDCard = (rule, value, callback) => {
  if (value) {
    if (!IDCard.test(Number(value))) {
      return callback(new Error('请输入正确的身份证号码'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}
// 手机号验证
var Isphone = (rule, value, callback) => {
  if (value) {
    if (!phone.test(value)) {
      return callback(new Error('请输入正确的手机号'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}
// 特殊字符验证
const reg = /^[a-zA-Z0-9\u4e00-\u9fa5_ ]+$/
var inputSpecialCharactersValidator = (rule, value, callback) => {
  if (!reg.test(value)) {
    callback(new Error('不允许特殊字符'))
  } else {
    callback()
  }
}
// 不能中文
var noChinese = (rule, value, callback) => {
  if (!chinese.test(value)) {
    callback(new Error('不能包含中文'))
  } else {
    callback()
  }
}

const pwdReg = new RegExp(/[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/);
var passwordStrengthValidator = (rule, value, callback)=>{
    if(!pwdReg.test(value)){
        callback(new Error("密码必须包含数字和字母组合"))
    }else{
        callback()
    }
}


export {
  expnoraml,
  number,
  isIDCard,
  Isphone,
  Isname,
  isEnName,
  inputSpecialCharactersValidator,
  noChinese,
  passwordStrengthValidator
}
