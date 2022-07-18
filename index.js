#!/usr/bin/env node
const CWD = process.cwd()
const program = require('commander')
const fs = require('fs-extra')
const inquirer = require('inquirer')
const path = require('path')
const Mustache = require('mustache')

const create = require('./create.js')

const { resolve } = path

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

// 简单打包
program.command('build').description('打包cli成功')

// 读取命令参数
program
  .command('param')
  .description('打包cli命令传参')
  .action((appName, options) => {
    const params = getParams(options)
    console.log(`打包cli成功, 对应的参数是`, params)
  })

// 读取配置文件
program
  .command('config')
  .description('读取配置文件')
  .action((appName, options) => {
    let config = {
      path: 'svg',
    }

    const configPath = CWD + '\\cb.config.js'
    // 如果使用了配置文件，则以配置文件为准
    if (fs.existsSync(configPath)) {
      const userConfig = require(resolve(CWD, 'cb.config.js'))
      config = { ...config, ...userConfig }
      console.log(`存在配置文件cb.config.js，获取到的名字为`, config.name)
    } else {
      console.log(`不存在配置文件`)
    }
  })

// 条件选择
program
  .command('condition')
  .description('条件选择')
  .action((appName, options) => {
    inquirer
      .prompt([
        {
          type: 'confirm',
          name: 'language',
          message: '新建项目是否引入typescript?',
        },
        {
          type: 'input',
          name: 'desc',
          message: '请输入项目备注',
        },
      ])
      .then(result => {
        console.log('请输入', result)
      })
  })

// 新建文件
program
  .command('create')
  .description('创建index文件')
  .action(async (appName, options) => {
    const copyPath = `/template/demo.vue`
    const pageName = 'new'
    console.log(path.join(CWD, copyPath))
    let template_content = await fs.readFile(path.join(CWD, copyPath))
    template_content = template_content.toString()
    const result = Mustache.render(template_content, {
      pageName,
    })
    //开始创建文件
    await fs.writeFile(path.join('./dist/', `${pageName}.vue`), result)
    console.log('\n页面创建成功!\n')
  })

// 注入依赖
program
  .version('0.1.0')
  .command('rely <name>')
  .description('新建一个项目注入依赖')
  .action(name => {
    create(name)
  })

program.parse(process.argv)
