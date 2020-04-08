
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

  }
]
let exportedMenu = [];
if (process.env.VUE_APP_DEBUG == 'ON') {
  exportedMenu = hookMenu
}

export default exportedMenu;