import { getAction, deleteAction, putAction, postAction } from '@/api/manage'

////根路径
// const doMian = "/jeecg-boot/";
////图片预览请求地址
// const imgView = "http://localhost:8080/jeecg-boot/sys/common/view/";

//角色管理
const addRole = (params) => postAction("/sys/role/add", params);
const editRole = (params) => putAction("/sys/role/edit", params);
// const getRoleList = (params)=>getAction("/sys/role/list",params);
// const deleteRole = (params)=>deleteAction("/sys/role/delete",params);
// const deleteRoleList = (params)=>deleteAction("/sys/role/deleteBatch",params);
const checkRoleCode = (params) => getAction("/sys/role/checkRoleCode", params);
const queryall = (params) => getAction("/sys/role/queryall", params);

//用户管理
const addUser = (params) => postAction("/sys/user/add", params);
const editUser = (params) => putAction("/sys/user/edit", params);
const queryUserRole = (params) => getAction("/sys/user/queryUserRole", params);
const getUserList = (params) => getAction("/sys/user/list", params);
// const deleteUser = (params)=>deleteAction("/sys/user/delete",params);
// const deleteUserList = (params)=>deleteAction("/sys/user/deleteBatch",params);
const frozenBatch = (params) => putAction("/sys/user/frozenBatch", params);
//验证用户是否存在
const checkOnlyUser = (params) => getAction("/sys/user/checkOnlyUser", params);
//改变密码
const changPassword = (params) => putAction("/sys/user/changPassword", params);

//权限管理
const addPermission = (params) => postAction("/sys/permission/add", params);
const editPermission = (params) => putAction("/sys/permission/edit", params);
const getPermissionList = (params) => getAction("/sys/permission/list", params);
/*update_begin author:wuxianquan date:20190908 for:添加查询一级菜单和子菜单查询api */
const getSystemMenuList = (params) => getAction("/sys/permission/getSystemMenuList", params);
const getSystemSubmenu = (params) => getAction("/sys/permission/getSystemSubmenu", params);
/*update_end author:wuxianquan date:20190908 for:添加查询一级菜单和子菜单查询api */

// const deletePermission = (params)=>deleteAction("/sys/permission/delete",params);
// const deletePermissionList = (params)=>deleteAction("/sys/permission/deleteBatch",params);
const queryTreeList = (params) => getAction("/sys/permission/queryTreeList", params);
const queryTreeListForRole = (params) => getAction("/sys/role/queryTreeList", params);
const queryListAsync = (params) => getAction("/sys/permission/queryListAsync", params);
const queryRolePermission = (params) => getAction("/sys/permission/queryRolePermission", params);
const saveRolePermission = (params) => postAction("/sys/permission/saveRolePermission", params);
//const queryPermissionsByUser = (params)=>getAction("/sys/permission/queryByUser",params);
const queryPermissionsByUser = (params) => getAction("/sys/permission/getUserPermissionByToken", params);
const loadAllRoleIds = (params) => getAction("/sys/permission/loadAllRoleIds", params);
const getPermissionRuleList = (params) => getAction("/sys/permission/getPermRuleListByPermId", params);
const queryPermissionRule = (params) => getAction("/sys/permission/queryPermissionRule", params);

// 部门管理
const queryDepartTreeList = (params) => getAction("/sys/sysDepart/queryTreeList", params);
const queryIdTree = (params) => getAction("/sys/sysDepart/queryIdTree", params);
const queryParentName = (params) => getAction("/sys/sysDepart/queryParentName", params);
const searchByKeywords = (params) => getAction("/sys/sysDepart/searchBy", params);
const deleteByDepartId = (params) => deleteAction("/sys/sysDepart/delete", params);

//日志管理
//const getLogList = (params)=>getAction("/sys/log/list",params);
const deleteLog = (params) => deleteAction("/sys/log/delete", params);
const deleteLogList = (params) => deleteAction("/sys/log/deleteBatch", params);

//数据字典
const addDict = (params) => postAction("/sys/dict/add", params);
const editDict = (params) => putAction("/sys/dict/edit", params);
//const getDictList = (params)=>getAction("/sys/dict/list",params);
const treeList = (params) => getAction("/sys/dict/treeList", params);
// const delDict = (params)=>deleteAction("/sys/dict/delete",params);
//const getDictItemList = (params)=>getAction("/sys/dictItem/list",params);
const addDictItem = (params) => postAction("/sys/dictItem/add", params);
const editDictItem = (params) => putAction("/sys/dictItem/edit", params);
//const delDictItem = (params)=>deleteAction("/sys/dictItem/delete",params);
//const delDictItemList = (params)=>deleteAction("/sys/dictItem/deleteBatch",params);

//字典标签专用（通过code获取字典数组）
export const ajaxGetDictItems = (code, params) => getAction(`/sys/dict/getDictItems/${code}`, params);

//系统通告
const doReleaseData = (params) => getAction("/sys/annountCement/doReleaseData", params);
const doReovkeData = (params) => getAction("/sys/annountCement/doReovkeData", params);
//获取系统访问量
const getLoginfo = (params) => getAction("/sys/loginfo", params);
const getVisitInfo = (params) => getAction("/sys/visitInfo", params);
//数据日志访问
// const getDataLogList = (params)=>getAction("/sys/dataLog/list",params);

// 根据部门主键查询用户信息
const queryUserByDepId = (params) => getAction("/sys/user/queryUserByDepId", params);

// 查询用户角色表里的所有信息
const queryUserRoleMap = (params) => getAction("/sys/user/queryUserRoleMap", params);
// 重复校验
const duplicateCheck = (params) => getAction("/sys/duplicate/check", params);
// 加载分类字典
const loadCategoryData = (params) => getAction("/sys/category/loadAllData", params);



// ✨ Bussiness Start - by Fred
import Rest, { sloter } from '@/config/api-mapper.js'

const getFiscalyear = (params) => getAction(Rest.GET_FISCALYEAR.url, params);
const closeFiscalyear = (params) => postAction(Rest.CLOSE_FISCALYEAR.url, params);
const openFiscalyear = (params) => postAction(Rest.OPEN_FISCALYEAR.url, params);
const getMaterials = (params) => getAction(Rest.GET_MATERIALS.url, params);
const createMaterial = (params) => postAction(Rest.CREATE_MATERIAL.url, params);
const updateMaterial = (params) => putAction(Rest.UPDATE_MATERIAL.url, params);

const getContracts = (params) => getAction(Rest.GET_CONTRACTS.url, params);
const getContract = (id, params) => getAction(sloter(Rest.GET_CONTRACT.url, id), params);
const createContract = (params) => postAction(Rest.CREATE_CONTRACT.url, params);
const updateContract = (params) => putAction(Rest.UPDATE_CONTRACT.url, params);
const approveContract = (params) => putAction(Rest.PUT_APPROVE_CONTRACT.url, params);

const getSaleContracts = (params) => getAction(Rest.GET_SALECONTRACTS.url, params);
const getSaleContract = (id, params) => getAction(sloter(Rest.GET_SALECONTRACT.url, id), params);
const createSaleContract = (params) => postAction(Rest.CREATE_SALECONTRACT.url, params);
const updateSaleContract = (params) => putAction(Rest.UPDATE_SALECONTRACT.url, params);

const getBankAccounts = (params) => getAction(Rest.GET_BANK_ACCOUNTS.url, params);

const getBanks = (params) => getAction(Rest.GET_BANKS.url, params);
const getSubBanks = (bankId, params) => getAction(sloter(Rest.GET_SUBANKS.url, bankId), params);

const getVendors = (params) => getAction(Rest.GET_SUPPLIERS.url, params);
const createVendor = (params) => postAction(Rest.CREATE_SUPPLIER.url, params);
const updateVendor = (params) => putAction(Rest.UPDATE_SUPPLIER.url, params);

const getSuplier = (id, params) => getAction(sloter(Rest.GET_SUPPLIER.url, id), params);


const getProjects = (params) => getAction(Rest.GET_PROJECTS.url, params);
const createProject = (params) => postAction(Rest.CREATE_PROJECT.url, params);
const updateProject = (params) => putAction(Rest.UPDATE_PROJECT.url, params);

const getCustomers = (params) => getAction(Rest.GET_CUSTOMERS.url, params);
const getCustomer = (id, params) => getAction(sloter(Rest.GET_CUSTOMER.url, id), params);
const createCustomer = (params) => postAction(Rest.CREATE_CUSTOMER.url, params);
const updateCustomer = (params) => putAction(Rest.UPDATE_CUSTOMER.url, params);


const getVendorPayment = (id, params) => getAction(sloter(Rest.GET_VENDORPAYMENT.url, id), params);
const getVendorPayments = (params) => getAction(Rest.GET_VENDORPAYMENTS.url, params);
const createVendorPayment = (params) => postAction(Rest.CREATE_VENDORPAYMENT.url, params);
const updateVendorPayment = (params) => putAction(Rest.UPDATE_VENDORPAYMENT.url, params);

const getSettlements = (params) => getAction(Rest.GET_SETTLEMENTS.url, params);
const getSettlement = (id, params) => getAction(sloter(Rest.GET_SETTLEMENT.url, id), params);
const createSettlement = (params) => postAction(Rest.CREATE_SETTLEMENT.url, params);
const updateSettlement = (params) => putAction(Rest.UPDATE_SETTLEMENT.url, params);

const getSaleInvoices = (params) => getAction(Rest.GET_SALEINVOICES.url, params);
const getSaleInvoice = (id, params) => getAction(sloter(Rest.GET_SALEINVOICE.url, id), params);
const createSaleInvoice = (params) => postAction(Rest.CREATE_SALEINVOICE.url, params);
const updateSaleInvoice = (params) => putAction(Rest.UPDATE_SALEINVOICE.url, params);

const getSaleReceipts = (params) => getAction(Rest.GET_SALERECEIPTS.url, params);
const getSaleReceipt = (id, params) => getAction(sloter(Rest.GET_SALERECEIPT.url, id), params);
const createSaleReceipt = (params) => postAction(Rest.CREATE_SALERECEIPT.url, params);
const updateSaleReceipt = (params) => putAction(Rest.UPDATE_SALERECEIPT.url, params);

const getInvoices = (params) => getAction(Rest.GET_VENDORINVOICES.url, params);
const getInvoice = (id, params) => getAction(sloter(Rest.GET_VENDORINVOICE.url, id), params);
const createInvoice = (params) => postAction(Rest.CREATE_VENDORINVOICE.url, params);
const updateInvoice = (params) => putAction(Rest.UPDATE_VENDORINVOICE.url, params);
const delInvoice = (params) => deleteAction(Rest.DEL_VENDORINVOICE.url, params);


const getSaleSettlements = (params) => getAction(Rest.GET_SALESETTLEMENTS.url, params);
const getSaleSettlement = (id, params) => getAction(sloter(Rest.GET_SALESETTLEMENT.url, id), params);
const createSaleSettlement = (params) => postAction(Rest.CREATE_SALESETTLEMENT.url, params);
const updateSaleSettlement = (params) => putAction(Rest.UPDATE_SALESETTLEMENT.url, params);



const getCompanies = (params) => getAction(Rest.GET_COMPANIES.url, params);
const updateCompany = (params) => putAction(Rest.UPDATE_COMPANY.url, params);
const getCompany = (id, params) => getAction(sloter(Rest.GET_COMPANY.url, id), params);

// ✨ Bussiness END - by Fred

export {
  // imgView,
  // doMian,
  addRole,
  editRole,
  checkRoleCode,
  addUser,
  editUser,
  queryUserRole,
  getUserList,
  queryall,
  frozenBatch,
  checkOnlyUser,
  changPassword,
  getPermissionList,
  addPermission,
  editPermission,
  queryTreeList,
  queryListAsync,
  queryRolePermission,
  saveRolePermission,
  queryPermissionsByUser,
  loadAllRoleIds,
  getPermissionRuleList,
  queryPermissionRule,
  queryDepartTreeList,
  queryIdTree,
  queryParentName,
  searchByKeywords,
  deleteByDepartId,
  deleteLog,
  deleteLogList,
  addDict,
  editDict,
  treeList,
  addDictItem,
  editDictItem,
  doReleaseData,
  doReovkeData,
  getLoginfo,
  getVisitInfo,
  queryUserByDepId,
  queryUserRoleMap,
  duplicateCheck,
  queryTreeListForRole,
  getSystemMenuList,
  getSystemSubmenu,
  loadCategoryData,
  // ✨ Bussiness Start - by Fred
  getFiscalyear,
  closeFiscalyear,
  openFiscalyear,
  getMaterials,
  createMaterial,
  updateMaterial,
  getBanks,
  getSubBanks,
  getVendors,
  createVendor,
  updateVendor,
  getSuplier,
  getCompanies,
  updateCompany,
  getCompany,
  getContracts,
  getContract,
  createContract,
  updateContract,
  approveContract,
  getCustomer,
  getCustomers,
  createCustomer,
  updateCustomer,
  getProjects,
  createProject,
  updateProject,
  getVendorPayment,
  getVendorPayments,
  createVendorPayment,
  updateVendorPayment,
  getSettlements,
  getSettlement,
  createSettlement,
  updateSettlement,
  getInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  delInvoice,
  getSaleInvoices,
  getSaleInvoice,
  createSaleInvoice,
  updateSaleInvoice,
  getSaleReceipts,
  getSaleReceipt,
  createSaleReceipt,
  updateSaleReceipt,
  getBankAccounts,
  getSaleContracts,
  getSaleContract,
  createSaleContract,
  updateSaleContract,
  getSaleSettlements,
  getSaleSettlement,
  createSaleSettlement,
  updateSaleSettlement,
  // ✨ Bussiness END - by Fred
}



