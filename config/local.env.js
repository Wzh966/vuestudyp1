'use strict'
module.exports = {
  NODE_ENV: '"production"',
  ENV_CONFIG:'"local"',
  // https://t01.shangquanshow.com/echarge  --98
  // http://localhost:9092/echarge          --local
  HOST:'"http://localhost:9092/echarge"',
  // PROJECTNAME:`${process.env.PROJECT}`
  PROJECTNAME: `"${process.env.PROJECT}"`
}

