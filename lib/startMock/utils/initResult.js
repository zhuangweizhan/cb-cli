const ResultConfig = {
  messageKey: "msg",
  statusKey: "status",
  dataKey: "data",
  statusSuccess: 1,
  statusError: 0,
};

// 获取结果
const Result = {
  ok: ({ data, msg = "操作成功" } = {}) => {
    return {
      [ResultConfig.messageKey]: msg,
      [ResultConfig.statusKey]: ResultConfig.statusSuccess,
      [ResultConfig.dataKey]: data,
    };
  },
  error: ({ data, msg = "操作失败" } = {}) => {
    return {
      [ResultConfig.messageKey]: msg,
      [ResultConfig.statusKey]: ResultConfig.statusError,
      [ResultConfig.dataKey]: data,
    };
  },
  info: ({ status, data, msg = "操作成功" } = {}) => {
    return {
      [ResultConfig.messageKey]: msg,
      [ResultConfig.statusKey]: status,
      [ResultConfig.dataKey]: data,
    };
  },
};

module.exports = {
  Result,
  ResultConfig
};
