import * as API from '@/api/api'

export default {
  data() {
    return {
      FormFieldOptions: {}
    }
  },
  mounted() {
    this.$initFieldsOptions()
  },
  methods: {
    initFields() {
      return []
    },
    request(item) {
      let func = this[`_${item.funcName}`]
      if (typeof func === 'function') {
        func.apply(this, [item.key, item.params, item.mapper])
      }
    },
    $initFieldsOptions() {
      let fields = this.initFields()
      fields.forEach(item => {
        this.request(item)
      })
    },
    _GetMaterials(key = "materialCode", params = {}, mapper) {
      this.__baseReq(API.getMaterials(params), key, mapper ? mapper : item => {
        return {
          node: item,
          // key: item.materialCode,
          // value: item.materialCode,
          key: item.id,
          value: item.id,
          label: item.materialName
        }
      });
    },
    _GetProjects(key = "projects", params = {}, mapper) {
      this.__baseReq(API.getProjects(params), key, mapper);
    },
    _GetVendors(key = "vendors", params = {}, mapper) {
      this.__baseReq(API.getVendors(params), key, mapper);
    },
    _GetContracts(key = "contracts", params = {}, mapper) {
      this.__baseReq(API.getContracts(params), key, mapper);
    },
    __baseReq(req, key, mapper = item => item) {
      if (!key) {
        return
      }
      if (req instanceof Promise) {
        req.then(res => {
          if (res.success) {
            this.FormFieldOptions = {
              ...this.FormFieldOptions,
              [key]: res.result.records.map(mapper)
            }
          } else {
            this.FormFieldOptions = {
              ...this.FormFieldOptions,
              [key]: []
            }
          }
        })
          .finally(() => { })
      }
    }
  },
}