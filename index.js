#!/usr/bin/env node
const CWD = process.cwd()
const program = require('commander')
const fs = require('fs-extra')
const inquirer = require('inquirer')
const path = require('path')
const create = require('./create.js')
const { resolve } = path
const { startMock } = require("./lib/startMock/index.js")

program.version('1.0.0')

const getParams = options => {
  options || (options = [])
  return options.reduce((prev, cur) => {
    if (cur.includes('=')) {
      const array = cur.split('=')
      return { ...prev, [array[0]]: array[1] }
    } else {
      return prev
    }
  }, {})
}

program
  .command("startMock")
  .description("启动mock服务")
  .action((appName, options) => {
    startMock()
  })



program.parse(process.argv)
