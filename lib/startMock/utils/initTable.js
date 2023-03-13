const { Result } = require("./initResult");
const { tranListToTreeData, formatToHump } = require("./utils");
const { generateDoc } = require("./generateDoc");
const { initDataSourceFn} = require("./fn");
const { getApiList } = require("./getApi");
const router = require('koa-router')()

const dataType = "jsonp"; //返回的格式
const StatusSuccess = 200;

// 分页对象
const PageConfig = {
  listKey: "list",
  pageNoKey: "pageNo",
  pageSizeKey: "pageSize",
  pageSizeDefault: 10,
  totalKey: "total",
};

// 初始化路由
function initTable(app, table, port) {
  generateDoc(table, port);

  Object.keys(table).forEach((tableName) => {
    const column = table[tableName].column;
    const dataSource = table[tableName].dataSource;

    //初始化数据源
    initDataSourceFn(dataSource, column, tableName);
    // 获取接口名称
    const apiList = getApiList(tableName);

    for (let i = 0; i < apiList.length; i++) {
      const { url, fn, name, type } = apiList[i];
      const requestType = type === 'post' ? "post" : 'get'
      const disSequestType = type !== 'post' ? "post" : 'get'
      router[requestType](`${url}`, async (ctx, next) => {
        const result = await fn(ctx)
        ctx.body = result
      })

      router[disSequestType](`${url}`, async (ctx, next) => {
        ctx.body = Result.error({ msg: `${url}接口的请求类型为${requestType}，请检查` });
      })

    }

    app.use(router.routes(), router.allowedMethods())
  });
}

module.exports = {
  initTable,
  router
};
