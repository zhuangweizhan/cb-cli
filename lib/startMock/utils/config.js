// const initTableName = (name) => {
//     return name.slice(0, 1).toUpperCase() + name.slice(1).toLowerCase();
// };

const { formatToHump } = require("./utils");

const ServiceConfig = {
    initPage: (name) => {
        return "/get" + formatToHump(name, true) + "Page";
    },
    initList: (name) => {
        return "/get" + formatToHump(name, true) + "List";
    },
    initTree: (name) => {
        return "/get" + formatToHump(name, true) + "Tree";
    },
    initDetail: (name) => {
        return "/get" + formatToHump(name, true) + "Detail";
    },
    initAdd: (name) => {
        return "/add" + formatToHump(name, true) + "";
    },
    initEdit: (name) => {
        return "/edit" + formatToHump(name, true) + "";
    },
    initDelete: (name) => {
        return "/del" + formatToHump(name, true) + "";
    },
};


module.exports = {
    ServiceConfig,
};
