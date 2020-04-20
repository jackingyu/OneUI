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
  GET_FISCALYEAR: {
    url: `/finance/fiscalyear`,
    method: 'get'
  },
  GET_FISCALYEAR_BY_COMPANY: {
    url: `/finance/fiscalyear/bycompany`,
    method: 'get'
  },
  CLOSE_FISCALYEAR: {
    url: `/finance/fiscalyear/close`,
    method: 'POST'
  },
  OPEN_FISCALYEAR: {
    url: `/finance/fiscalyear/open`,
    method: 'POST'
  },
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
  //----- 银行账户 --
  GET_BANK_ACCOUNTS: {
    url: `/masterdata/bankaccounts`,
    method: 'GET'
  },
  //----- 客户 -- 
  GET_CUSTOMER: {
    url: `/masterdata/customers/%@`,
    method: 'GET'
  },
  GET_CUSTOMERS: {
    url: `/masterdata/customers`,
    method: 'GET'
  },
  CREATE_CUSTOMER: {
    url: `/masterdata/customers`,
    method: 'POST'
  },
  UPDATE_CUSTOMER: {
    url: `/masterdata/customers`,
    method: 'PUT'
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
  UPDATE_PROJECT: {
    url: `/masterdata/projects`,
    method: 'PUT'
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
  //----- 公司 -- 
  GET_COMPANIES: {
    url: `/company`,
    method: 'GET'
  },
  GET_COMPANY: {
    url: `/company/%@`,
    method: 'GET'
  },
  UPDATE_COMPANY: {
    url: `/company`,
    method: 'put'
  },
  //---- 合同
  GET_CONTRACTS: {
    url: '/purchasecontracts',
    method: 'GET'
  },
  GET_CONTRACT: {
    url: '/purchasecontracts/%@',
    method: 'GET'
  },
  CREATE_CONTRACT: {
    url: '/purchasecontracts',
    method: 'POST'
  },
  UPDATE_CONTRACT: {
    url: '/purchasecontracts',
    method: 'PUT'
  },
  PUT_APPROVE_CONTRACT: {
    url: '/purchasecontracts/approve',
    method: 'PUT'
  },
  // GET_CONTRACT_ITEMS: {
  //   url: '/purchasecontracts/items',
  //   method: 'GET'
  // },
  //---- 供应商结算
  GET_SETTLEMENT: {
    url: '/vendorsettlements/%@',
    method: 'GET'
  },
  GET_SETTLEMENTS: {
    url: '/vendorsettlements',
    method: 'GET'
  },
  GET_SETTLEMENTS_ITEMS: {
    url: '/vendorsettlementitems',
    method: 'GET'
  },
  CREATE_SETTLEMENT: {
    url: '/vendorsettlements',
    method: 'POST'
  },
  UPDATE_SETTLEMENT: {
    url: '/vendorsettlements',
    method: 'PUT'
  },
  APPROVE_SETTLEMENT: {
    url: '/vendorsettlements/approve',
    method: 'PUT'
  },
  //---- 供应商付款
  GET_VENDORPAYMENT: {
    url: '/vendorpayments/%@',
    method: 'GET'
  },
  GET_VENDORPAYMENTS: {
    url: '/vendorpayments',
    method: 'GET'
  },
  APPROVE_VENDORPAYMENT: {
    url: '/vendorpayments/approve',
    method: 'put'
  },
  CREATE_VENDORPAYMENT: {
    url: '/vendorpayments',
    method: 'POST'
  },
  UPDATE_VENDORPAYMENT: {
    url: '/vendorpayments',
    method: 'PUT'
  },
  //---- 供应商发票
  GET_VENDORINVOICE: {
    url: '/vendorinvoices/%@',
    method: 'GET'
  },
  GET_VENDORINVOICES: {
    url: '/vendorinvoices',
    method: 'GET'
  },
  CREATE_VENDORINVOICE: {
    url: '/vendorinvoices',
    method: 'POST'
  },
  UPDATE_VENDORINVOICE: {
    url: '/vendorinvoices',
    method: 'PUT'
  },
  DEL_VENDORINVOICE: {
    url: '/vendorinvoices/%@',
    method: 'DELETE'
  },
  //---- 销售开票
  GET_SALEINVOICES: {
    url: '/salesinvoices',
    method: 'GET'
  },
  GET_SALEINVOICE: {
    url: '/salesinvoices/%@',
    method: 'GET'
  },
  CREATE_SALEINVOICE: {
    url: '/salesinvoices',
    method: 'POST'
  },
  UPDATE_SALEINVOICE: {
    url: '/salesinvoices',
    method: 'PUT'
  },
  //---- 销售收款
  GET_SALERECEIPTS: {
    url: '/salesreceipts',
    method: 'GET'
  },
  GET_SALERECEIPT: {
    url: '/salesreceipts/%@',
    method: 'GET'
  },
  CREATE_SALERECEIPT: {
    url: '/salesreceipts',
    method: 'POST'
  },
  UPDATE_SALERECEIPT: {
    url: '/salesreceipts',
    method: 'PUT'
  },
  //----  销售结算
  GET_SALESETTLEMENT: {
    url: '/salesbillingdocuments/%@',
    method: 'GET'
  },
  GET_SALESETTLEMENTS: {
    url: '/salesbillingdocuments',
    method: 'GET'
  },
  CREATE_SALESETTLEMENT: {
    url: '/salesbillingdocuments',
    method: 'POST'
  },
  UPDATE_SALESETTLEMENT: {
    url: '/salesbillingdocuments',
    method: 'PUT'
  },
  //----  销售合同
  GET_SALECONTRACT: {
    url: '/salescontracts/%@',
    method: 'GET'
  },
  GET_SALECONTRACTS: {
    url: '/salescontracts',
    method: 'GET'
  },
  CREATE_SALECONTRACT: {
    url: '/salescontracts',
    method: 'POST'
  },
  UPDATE_SALECONTRACT: {
    url: '/salescontracts',
    method: 'PUT'
  },
  APPROVE_SALECONTRACT: {
    url: '/salescontracts/approve',
    method: 'PUT'
  },
}