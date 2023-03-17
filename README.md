## 分享搭建自己的脚手架cb-cli

###  cb startMock 

#### 功能介绍

* 能快速自定义我们的数据格式，能快速生成增删改查接口
* 支持三种模式，自定义模式，json模式，sql模式
* 支持接口校验，如必填，长度等校验
* 能自定义返回接口格式，统一数据格式规范，项目也支持自定义规范
* 与项目本身脱离解耦，可快速替换真实链接
* 支持生成api文档说明

#### 配置案例：mock.config.js

module.exports = {
    common: {//支持公用配置
        port: 8000,
        timeout: 0,
        rate: 1,
    },
    sqlDataSource: [//支持sql数据源
        `
      CREATE TABLE \`jsh_depot\` (
        \`id\` bigint NOT NULL AUTO_INCREMENT COMMENT '主键',
        \`name\` varchar(20) DEFAULT NULL COMMENT '仓库名称',
        \`address\` varchar(50) DEFAULT NULL COMMENT '仓库地址',
        \`warehousing\` decimal(24,6) DEFAULT NULL COMMENT '仓储费',
        \`truckage\` decimal(24,6) DEFAULT NULL COMMENT '搬运费',
        \`type\` int DEFAULT NULL COMMENT '类型',
        \`sort\` varchar(10) DEFAULT NULL COMMENT '排序',
        \`remark\` varchar(100) DEFAULT NULL COMMENT '描述',
        \`principal\` bigint DEFAULT NULL COMMENT '负责人',
        \`tenant_id\` bigint DEFAULT NULL COMMENT '租户id',
        \`delete_Flag\` varchar(1) DEFAULT '0' COMMENT '删除标记，0未删除，1删除',
        \`is_default\` bit(1) DEFAULT NULL COMMENT '是否默认',
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb3 COMMENT='仓库表';

      insert  into \`jsh_depot\`(\`id\`,\`name\`,\`address\`,\`warehousing\`,\`truckage\`,\`type\`,\`sort\`,\`remark\`,\`principal\`,\`tenant_id\`,\`delete_Flag\`,\`is_default\`) values (14,'仓库1','dizhi','12.000000','12.000000',0,'1','描述',131,63,'0','');
      insert  into \`jsh_depot\`(\`id\`,\`name\`,\`address\`,\`warehousing\`,\`truckage\`,\`type\`,\`sort\`,\`remark\`,\`principal\`,\`tenant_id\`,\`delete_Flag\`,\`is_default\`) values (15,'仓库2','地址100','555.000000','666.000000',0,'2','dfdf',131,63,'0','\0');
      insert  into \`jsh_depot\`(\`id\`,\`name\`,\`address\`,\`warehousing\`,\`truckage\`,\`type\`,\`sort\`,\`remark\`,\`principal\`,\`tenant_id\`,\`delete_Flag\`,\`is_default\`) values (17,'仓库3','123123','123.000000','123.000000',0,'3','123',131,63,'0','\0');

      `
    ],
    jsonDataSource: [//支持json数据源
        {
            account_detail: {
                column: [
                    "id",
                    { key: 'username', required: true, maxLength: 10 },
                    "auth_key",
                    "password_hash",
                    "password_reset_token",
                    "email",
                    "created_at",
                ],
                dataSource: [
                    {
                        "id": 13,
                        "email": "368938"
                    },
                    [14, 45457]
                ],
            },
        },
    ],
    customDataSource: [[//支持自定义数据源
        {
            url: "/login",
            returnFn: (req) => {
                const { name, password } = req.query;
                if (name === 'admin' || password === 'a123456') {
                    return { status: 1, msg: "登录成功" }
                }
                return { status: 0, msg: "账号或密码错误" }

            }
        },
        {
            url: "/addUser",
            type: "post",
            returnFn: (req) => {
                const { name } = req.request.body;
                if (name !== '' && name !== undefined) {
                    return { status: 1, msg: "新增账号成功" }
                }
                return { status: 0, msg: "请输入用户名" }

            }
        },
    ]
};
