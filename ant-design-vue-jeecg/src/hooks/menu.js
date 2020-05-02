
const hookMenu = [
  {
    "id": "80015b2769fc80648e92d04e84ca059d",
    "path": "/dashboard2",
    "name": "dashboard2",
    "component": "dashboard/Analysis",
    "route": "1",
    "meta": {
      "title": "DashBoard",
      "icon": "setting",
      "keepAlive": false,
      "internalOrExternal": false
    },
  },
  {
    "id": "89015b2769fc80643392d04e84ca059d",
    "path": "/vendor/report",
    "name": "vendorreports",
    "component": "stastics/VendorsReportList",
    "route": "1",
    "meta": {
      "title": "供应商总账报表",
      "icon": "setting",
      "keepAlive": false,
      "internalOrExternal": false
    },
  },
  {
    "id": "89015b2711fc80643392d04e84ca059d",
    "path": "/vendor/report/detail",
    "name": "vendorreport",
    "component": "stastics/VendorReport",
    "route": "1",
    "meta": {
      "title": "供应商报表详情",
      "icon": "setting",
      "keepAlive": false,
      "internalOrExternal": false
    },
  },
  {
    "id": "89015b27698617643392d04e84ca059d",
    "path": "/customer/report",
    "name": "customerreports",
    "component": "stastics/CustomerReportList",
    "route": "1",
    "meta": {
      "title": "客户总账报表",
      "icon": "setting",
      "keepAlive": false,
      "internalOrExternal": false
    },
  },
  {
    "id": "89015b2769fc80643392d04e84ca059d",
    "path": "/customer/report/detail",
    "name": "customerreport",
    "component": "stastics/CustomerReport",
    "route": "1",
    "meta": {
      "title": "客户总账报表详情",
      "icon": "setting",
      "keepAlive": false,
      "internalOrExternal": false
    },
  },
]
let exportedMenu = [];
if (process.env.VUE_APP_DEBUG == 'ON') {
  exportedMenu = hookMenu
}

export default exportedMenu;