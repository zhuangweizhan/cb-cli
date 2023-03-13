const { ResultConfig } = require("./initResult");

let tableDataSource = {};
let tableColumn = [];

// 初始化column
const initColumn = (column) => {
    if (!column) {
        return [];
    }
    return column.map((item, index) => {
        if (typeof item === "string") {
            //字符串的话，说明是item的值
            return { key: item }
        }
        return item;
    })
}

// 初始化dataSource
const initDataSource = (dataSource, column) => {
    if (!dataSource) {
        return [];
    }
    const result = dataSource.map((tableItem, index) => {
        if (Array.isArray(tableItem)) {
            const obj = tableItem.reduce((prev, cur, gIndex) => {
                return { ...prev, [column[gIndex].key]: cur }
            }, {});
            return obj;
        }
        return tableItem;
    })
    return result
}

// 初始化数据源
const initDataSourceFn = (dataSource, column, tableName) => {
    tableColumn = { ...tableColumn, [tableName]: column };;
    tableDataSource = { ...tableDataSource, [tableName]: dataSource };
};

//根据分页获取
const getDataPageFn = (query, tableName) => {
    //获取分页数
    const pageNo = query[PageConfig.pageNoKey] ? query[PageConfig.pageNoKey] : 1;

    //获取分页数
    const pageSize = query[PageConfig.pageSizeKey]
        ? query[PageConfig.pageSizeKey]
        : PageConfig.pageSizeDefault;

    // 过滤掉数据源
    Object.keys(query).forEach((columnKey) => {
        if (tableColumn[tableName].includes(columnKey)) {
            // 说明查询需要过滤
            tableDataSource[tableName] = tableDataSource[tableName].filter((item) => {
                return item[columnKey].includes(query[columnKey]);
            });
        }
    });

    // 分页取对应的数据
    const list = tableDataSource[tableName].slice((pageNo - 1) * pageSize, pageNo * pageSize);

    return {
        [PageConfig.listKey]: list,
        [PageConfig.pageNoKey]: pageNo,
        [PageConfig.pageSizeKey]: pageSize,
        [PageConfig.totalKey]: tableDataSource[tableName].length,
    };
};

//根据所有数据
const getDataListFn = (query, tableName) => {
    // 过滤掉数据源
    Object.keys(query).forEach((columnKey) => {
        if (tableColumn[tableName].includes(columnKey)) {
            // 说明查询需要过滤
            tableDataSource[tableName] = tableDataSource[tableName].filter((item) => {
                return item[columnKey].includes(query[columnKey]);
            });
        }
    });

    return tableDataSource[tableName];
};

//根据所有数据
const getDataTreeFn = (query, tableName) => {
    // 过滤掉数据源
    Object.keys(query).forEach((columnKey) => {
        if (tableColumn[tableName].includes(columnKey)) {
            // 说明查询需要过滤
            tableDataSource[tableName] = tableDataSource[tableName].filter((item) => {
                return item[columnKey].includes(query[columnKey]);
            });
        }
    });
    if (tableColumn[tableName].includes["pid"]) {
        return tranListToTreeData(tableDataSource[tableName]);
    } else {
        return tableDataSource[tableName];
    }
};

//获取详情接口
const getDetailFn = (query = {}, tableName) => {
    if (!(query.id)) {
        return undefined;
    }
    return tableDataSource[tableName].reduce((prev, cur) => {
        return Number(query.id) === cur.id ? cur : prev;
    }, undefined);
};

//获取新增接口
const addFn = (query, tableName) => {
    let maxId = tableDataSource[tableName].reduce((prev, curr, index) => {
        return curr.id > prev ? curr.id : prev;
    }, 1);
    maxId++;
    let msg = "";
    tableColumn[tableName].forEach((column) => {
        if (column.required) {
            if (query[column.key] === undefined) {
                msg += column.key + '字段必填;'
            } else if (query[column.key].length > column.maxLength ) {
                msg += column.key + '字段长度限制为' + column.maxLength + ";"
            }
        }
    })
    if ( msg ) {
        return { status: ResultConfig.statusError,  data: {}, msg }
    }
    tableDataSource[tableName].push({ ...query, id: maxId });
    return { status: ResultConfig.statusSuccess, data: { id: maxId }, msg: "新增成功" }
};

//获取新增接口
const editFn = (query, tableName) => {
    const index = tableDataSource[tableName].reduce((prev, curr, index) => {
        return curr.id === Number(query.id) ? index : prev;
    }, -1);

    const newObj = Object.assign(tableDataSource[tableName][index], query);
    tableDataSource[tableName][index] = newObj;
};

//获取新增接口
const delFn = (query, tableName) => {
    const index = tableDataSource[tableName].reduce((prev, curr, index) => {
        return curr.id === Number(query.id) ? index : prev;
    }, -1);
    tableDataSource[tableName].splice(index, 1);
};

module.exports = {
    initColumn, initDataSource, initDataSourceFn, getDataPageFn, getDataListFn, getDataTreeFn, getDetailFn, addFn, editFn, delFn
};
