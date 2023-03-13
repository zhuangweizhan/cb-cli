const fs = require('fs');
const { getApiList } = require("./getApi");

// 获取结果
const generateDoc = (table, port) => {
    let str = '';
    Object.keys(table).forEach(key => {
        str += `## ${key}模块

|  参数名称  |  参数说明  |  数据类型  |  长度(字节)  |  是否必填  |  默认值  | 
|  -------  |  -------  |  ------  |  -----  |  -------  |  ---------  |
`
        const { column } = table[key]
        column.forEach(cItem => {
            const name = cItem.key;
            const type = cItem.type;
            const comment = cItem.comment ? cItem.comment : '-';
            const defaultValue = cItem.default ? cItem.default : '-';
            const isRequired = cItem.required ? "是" : "否"
            const maxLength = cItem.maxLength ? cItem.maxLength : "-"
            str += `| ${name} | ${comment} | ${type} | ${maxLength} | ${isRequired} | ${defaultValue} |\n`
        })



        // 获取接口名称
        const apiList = getApiList(key);
        for (let i = 0; i < apiList.length; i++) {
            const { url, name, type } = apiList[i]
            str += `###  http://localhost:${port}${url}
             
接口说明：${name}
请求类型: ${type}
            \n`

        }
    })

    fs.writeFile('./mock.md', str, function (err) {
    })

}

module.exports = {
    generateDoc
};
