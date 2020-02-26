export function sloter(literal, ...substitutions) {
  let literals = literal.split('%@');
  let result = "";
  //	仅使用	substitution的元素数量来进行循环
  for (let i = 0; i < substitutions.length; i++) {
    result += literals[i];
    result += substitutions[i];
  }
  //	添加最后一个字面量
  result += literals[literals.length - 1];
  return result;
}

export default {
  CREATE_MATERIAL: {
    url: `/masterdata/materials`,
    method: 'POST'
  },
  UPDATE_MATERIAL: {
    url: `/masterdata/materials`,
    method: 'PUT'
  },
  //获取物料List
  GET_MATERIALS: {
    url: `/masterdata/materials`,
    method: 'GET'
  },
  //----- 供应商 -- 
  GET_SUPPLIERS: {
    url: `/masterdata/vendors`,
    method: 'GET'
  },
  GET_SUPPLIER: {
    url: `/masterdata/vendors/%@`,
    method: 'GET'
  },
  CREATE_SUPPLIER: {
    url: `/masterdata/vendors`,
    method: 'POST'
  },
  UPDATE_SUPPLIER: {
    url: `/masterdata/vendors`,
    method: 'PUT'
  },
  DEL_SUPPLIER_BANK: {
    url: `/masterdata/vendors/bankaccount/%@`,
    method: 'delete'
  },
  //----- 客户 -- 
  GET_CUSTOMERS: {
    url: `/masterdata/customers`,
    method: 'GET'
  },
  CREATE_CUSTOMER: {
    url: `/masterdata/customers`,
    method: 'POST'
  },
  DEL_CUSTOMER_BANK: {
    url: `/masterdata/customers/bankaccount/%@`,
    method: 'delete'
  },
  //----- 项目 -- 
  GET_PROJECTS: {
    url: `/masterdata/projects`,
    method: 'GET'
  },
  CREATE_PROJECT: {
    url: `/masterdata/projects`,
    method: 'POST'
  },
  UPDATE_PROJECT_BANK: {
    url: `/masterdata/projects`,
    method: 'PUT'
  },
  //----- 银行config -- 
  GET_BANKS: {
    url: `/masterdata/banks`,
    method: 'GET'
  },
  GET_SUBANKS: {
    url: `/masterdata/banks/%@`,
    method: 'GET'
  },
}