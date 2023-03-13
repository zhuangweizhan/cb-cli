const {  getDataPageFn, getDataListFn, getDataTreeFn, getDetailFn, addFn, editFn, delFn } = require("./fn");
const { ServiceConfig } = require("./config");
const { Result } = require("./initResult");


const getApiList = (tableName) => {
    const serverList = [
        {
          name: '获取列表数据',
          url: ServiceConfig.initList(tableName),
          type: 'get',
          fn: (ctx, res, next) => {
            const data = getDataListFn(ctx.query, tableName);
            return Result.ok({ data: data });
          }
        },
        {
          name: '获取分页列表数据',
          url: ServiceConfig.initPage(tableName),
          type: 'get',
          fn: (ctx, res, next) => {
            const data = getDataPageFn(ctx.query, tableName);
            return Result.ok({ data: data });
          }
        },
        {
          name: '获取树状数据',
          url: ServiceConfig.initTree(tableName),
          type: 'get',
          fn: (ctx, res, next) => {
            const data = getDataTreeFn(ctx.query, tableName);
            return Result.ok({ data: data });
          }
        },
        {
          name: '根据id获取详情',
          url: ServiceConfig.initDetail(tableName),
          type: 'get',
          fn: (ctx, res, next) => {
            //获取详情
            const data = getDetailFn(ctx.query, tableName);
            if (!data) {
              return Result.error({ msg: "请输入id,未找到该元素" });
            }
            //成功
            return Result.ok({ data: data });
          }
        },
        {
          name: '新增接口',
          url: ServiceConfig.initAdd(tableName),
          type: 'post',
          fn: (ctx, res, next) => {
            console.log(`ctx====`, ctx.request.body);
            const { data, msg, status } = addFn(ctx.request.body, tableName);
            return Result.info({ data, msg, status });
          }
        },
        {
          name: '根据id编辑接口',
          url: ServiceConfig.initEdit(tableName),
          type: 'post',
          fn: (ctx, res, next) => {
            const data = getDetailFn(ctx.request.body, tableName);
            if (!data) {
              return Result.error({ msg: "请输入id,未找到该元素" });
            }
            editFn(ctx.request.body, tableName);
            return Result.ok();
          }
        },
        {
          name: '根据id删除接口',
          url: ServiceConfig.initDelete(tableName),
          type: 'post',
          fn: (ctx, res, next) => {
            const data = getDetailFn(ctx.request.body, tableName);
            if (!data) {
              return Result.error({ msg: "请输入id,未找到该元素" });
            }
            delFn(ctx.request.body, tableName);
            return Result.ok();
          }
        }
    ]
    return serverList
}


module.exports = {
    getApiList
  };