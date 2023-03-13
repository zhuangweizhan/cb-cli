const { startServer } = require("./server");
const CWD = process.cwd()
const path = require("path")
const { resolve } = path
const fs = require('fs');

const startMock = () => {
    const configPath = CWD + "\\mock.config.js"
    let config = {
        common: {//公用配置
            port: 8000,//端口号
        },
        patternConfig: {//数据格式相关配置
        },
        sqlDataSource: [], //支持sql的数据源
        jsonDataSource: [], //支持json的数据源
        customDataSource: [] //支持自定义数据源
    };

    // 如果使用了配置文件，则以配置文件为准
    if (fs.existsSync(configPath)) {
        const userConfig = require(resolve(CWD, "mock.config.js"))
        config = { ...config, ...userConfig }
    } else {
        console.error("请检查根路径:", configPath)
        return
    }

    startServer(config);

    console.log(`mock服务启动成功,端口号为:`,  config.common.port);
}



module.exports = {
    startMock
  }
  