
const Koa = require('koa')
const path = require('path')
const views = require('koa-views')
const json = require('koa-json')
const logger = require('koa-logger')
const onerror = require('koa-onerror')
const koaBody = require('koa-body'); // 解析 multipart、urlencoded和json格式的请求体
const { mock } = require("mockjs");
const bodyParser = require('koa-bodyparser');

const { initColumn, initDataSource } = require("./utils/fn");
const { initTable } = require("./utils/initTable");
const { initSql } = require("./utils/initSql");

const fs = require('fs');
const app = new Koa();


async function startServer(config) {
    const { port } = config.common;
    console.log(`端口号为:`, port);

    // error-handling
    app.on('error', (err, ctx) => {
        console.log('server error', err, ctx)
        console.error('server error', err, ctx)
    });

    app.use(json())
    app.use(logger())
    app.use(koaBody());
    app.use(bodyParser({
        enableTypes: ['json', 'form', 'text'],
        multipart: true
    }));

    // logger
    app.use(async (ctx, next) => {
        const start = new Date()
        await next()
        const ms = new Date() - start
        console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
    })

    // 清除require缓存，每次都可以获取最新数据
    // // 获取配置数据
    const { common } = config;

    let tableDataSource = config['jsonDataSource'] ? config['jsonDataSource'] : []
    let sqlDataSource = config['sqlDataSource'] ? initSql(config['sqlDataSource']) : []
    let customDataSource = config['customDataSource'] ? config['customDataSource'] : []

    const allDataSource = { ...tableDataSource[0], ...sqlDataSource[0] }

    Object.keys(allDataSource).forEach((key) => {
        const { column, dataSource } = allDataSource[key];
        const newColumn = initColumn(column);
        allDataSource[key].column = newColumn
        allDataSource[key].dataSource = initDataSource(dataSource, newColumn)
    });

    initTable(app, allDataSource, port); //初始化路由

    // fs.writeFile('./test.json', JSON.stringify(allDataSource), function (err) {
    //     // if (err) {res.status(500).send('Server is error...')}
    // })

    app.listen(port)
}

module.exports = {
    startServer
}
