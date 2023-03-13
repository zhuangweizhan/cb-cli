// 根据pid将数组转为tree结构
const tranListToTreeData = (list, rootValue) => {
  //定义个空数组接收参数
  var arr = [];
  list.forEach((item) => {
    if (item.pid === rootValue) {
      // 找到之后 就要去找 item 下面有没有子节点
      //条件不能是(list, rootValue),否则死递归
      const children = tranListToTreeData(list, item.id);
      if (children.length) {
        // 如果children的长度大于0 说明找到了子节点
        item.children = children;
      }
      arr.push(item); // 把找到的数据内容加入到数组中
    }
  });
  //返回这个数组
  return arr;
}

// 字符串下划线转驼峰, isFrist是否首字母大写
const formatToHump = (value, isFrist = false) => {
  let result = value.replace(/\_(\w)/g, (_, letter) => letter.toUpperCase())
  if (isFrist) {
    return result.slice(0, 1).toUpperCase() + result.slice(1)
  }
  return result
}

// const initTableName = (name) => {
//     return name.slice(0, 1).toUpperCase() + name.slice(1).toLowerCase();
// };


module.exports = {
  tranListToTreeData,
  formatToHump
};
