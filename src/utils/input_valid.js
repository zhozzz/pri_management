// 所有符号禁止
const wholeValid = function (value) {
  value = value
    .replace(
      // eslint-disable-next-line no-useless-escape
      /[`~!@#$%^&*()_\-+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*（）——\|《》？：“”【】、；‘’，。、]/g,
      ''
    )
    .replace(/\s/g, '')
  return value
}
// 可以使用下划线
const loginValid = function (value) {
  value = value
    .replace(
      // eslint-disable-next-line no-useless-escape
      /[`~!@#$%^&*()\-+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*（）——\|《》？：“”【】、；‘’，。、]/g,
      ''
    )
    .replace(/\s/g, '')
  return value
}

export default {
  wholeValid,
  loginValid
}
