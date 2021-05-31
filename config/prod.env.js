'use strict'
// 传参
// const baseName = JSON.parse(process.env.npm_config_argv).original[2]
module.exports = {
  NODE_ENV: '"production"',
  ENV_CONFIG:'"prod"',
  HOST:'"https://t01.shangquanshow.com/echarge"',
  PROJECTNAME: `"${process.env.PROJECT}"`
  // PROJECTNAME: '"'+baseName+'"'
}
