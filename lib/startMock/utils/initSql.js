'use strict';
const { tranListToTreeData, formatToHump } = require("./utils");

var clearComments = function (data) {
  data = data.replace(/\/\*(.*)/g, '').replace(/([ \t]*\n){3,}/g, '\n\n');
  return data;
};

var initSql = function (sqlArray) {

  return sqlArray.reduce((prev, cur) => {

    let data = cur;
    var output = {};
    data = clearComments(data);
    var chunksArray = data.split('\n\n');

    // 说明是建表，先把所有的表创建
    chunksArray.forEach(function (chunksItem) {
      if (chunksItem.includes('CREATE TABLE')) {
        var tableMatch = chunksItem.match('CREATE TABLE `(.*)`');
        let columnArray = []
        if (tableMatch) {
          const tableName = tableMatch[1];
          output[tableName] = {};
          var lines = chunksItem.split('\n');
          lines.forEach(function (line, index) {
            if (~line.indexOf(' KEY ') || ~line.indexOf('CREATE TABLE') || index === 0) {
              return;
            }

            var nameMatch = line.match(' `(.*)`');
            var maxLengthMatch = line.match(' varchar\\((.*)\\) ');
            var defaultMatch = line.match(' DEFAULT \'(.*)\' ');
            var commentMatch = line.match(' COMMENT \'(.*)\',');


            var typePattern = / (?:\w+)(.*?) /;
            var typeMatch = line.match(typePattern, "$0");
            var requiredReg = /NOT NULL/.test(line);
            if (nameMatch) {
              const key = nameMatch[1]
              const maxLength = maxLengthMatch && maxLengthMatch.length > 0 ? Number(maxLengthMatch[1]) : undefined;
              const required = !requiredReg;
              const defaultValue = defaultMatch && defaultMatch.length > 0 ? defaultMatch[1] : undefined;
              const comment = commentMatch && commentMatch.length > 0 ? commentMatch[1] : undefined;
              const typeDb = typeMatch && typeMatch.length > 0 ? typeMatch[0] : [];

              let type = 'string';
              if (typeDb.includes('int') || typeDb.includes('bigint')) {
                type = 'number'
              }
              if (typeDb.includes('boolean')) {
                type = 'boolean'
              }

              columnArray.push({ key, maxLength, required, type, default: defaultValue, comment });
            }
          });
          output[tableName].column = columnArray;
        }
      }
    })

    // 再识别所有的数据源
    chunksArray.forEach(function (chunksItem) {
      if (chunksItem.includes('insert')) {
        // var lines = chunksItem.split('\n');

        // chunksItem.forEach(function (chunksItem) {
        //  insert into \`jsh_depot\`(\`id\`,\`name\`,\`address\`,\`warehousing\`,\`truckage\`,\`type\`,\`sort\`,\`remark\`,\`principal\`,\`tenant_id\`,\`delete_Flag\`,\`is_default\`) values (17,'仓库3','123123','123.000000','123.000000',0,'3','123',131,63,'0','\0');

        var lines = chunksItem.split('\n');

        var nameMatch = chunksItem.match(' insert  into `(.*)`\\(');
        var tableName = nameMatch[1]

        if (nameMatch) {

          let dataSource = []
          lines.forEach((line, index) => {
            var keyListMatch = line.match('\\((.*?)\\)');
            var valueListMatch = line.match('values \\((.*?)\\)');
            if (keyListMatch && valueListMatch) {
              var keyListStr = keyListMatch[1]
              var valueListStr = valueListMatch[1]
              var keyList = keyListStr.replace(/\`/g, '').split(',')
              var valueList = valueListStr.replace(/\`/g, '').replace(/\'/g, '').split(',')

              const insertData = {};
              for (let i = 0; i < keyList.length; i++) {
                const type = output[tableName].column[i].type
                let value = valueList[i]
                type === 'number' && (value = Number(value))
                insertData[formatToHump(keyList[i])] = value;
              }
              dataSource.push(insertData)
            }

          });
          output[tableName].dataSource = dataSource;
        }

      }
    })
    // output[tableName] = { column: columnArray, dataSource: [] };

    return [...prev, output]

  }, [])










};


module.exports = {
  initSql,
};