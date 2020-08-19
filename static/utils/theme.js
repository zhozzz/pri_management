/*
 * @Description:
 * @Author:
 * @Date: 2019-11-15 11:35:13
 * @LastEditors: fylih
 * @LastEditTime: 2019-11-15 11:35:41
 */
let theme = JSON.parse(localStorage.getItem('theme')) || 1
window.localStorage.setItem('theme', theme)
let pageBody = document.body || document.getElementsByTagName('body')
pageBody.className = theme == 1 ? 'standard' : 'technology'
