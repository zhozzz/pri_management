/*
 * @Description:
 * @Author: wentoo
 * @Github:
 * @Date: 2019-08-19 12:23:16
 * @LastEditors: wentoo
 * @LastEditTime: 2019-08-22 10:32:42
 */
// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  plugins: ['vue'],
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    camelcase: 1,
    'no-return-await': 0,
    'no-unused-vars': process.env.NODE_ENV === 'production' ? 1 : 0,
    'valid-v-on': process.env.NODE_ENV === 'production' ? 1 : 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
}
