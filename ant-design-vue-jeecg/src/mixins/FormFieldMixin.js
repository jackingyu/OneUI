import * as API from '@/api/api'

export default {
  data() {
    return {
      FormFieldOptions: {},
      FieldsSet: {}
    }
  },
  mounted() {
    this.$initFieldsOptions()
  },
  methods: {
    initFields() {
      return Object.values(this.FieldsSet)
    },
    request(item) {
      let func = this[`_${item.funcName}`]
      if (typeof func === 'function') {
        func.apply(this, [item.key, item.params, item.mapper, item.resTransformer])
      }
    },
    $initFieldsOptions() {
      let fields = this.initFields()
      fields.forEach(item => {
        this.request(item)
      })
    },
    _GetBankAccounts(key = "bankAccounts", params = {},
      mapper, resTransformer = res => res.result
    ) {
      this.__baseRequest(API.getBankAccounts(params), key, mapper, resTransformer);
    },
    _GetBanks(key = "banks", params = {},
      mapper = item => ({
        label: item.bank_name,
        key: item.bank_id,
        value: `${item.bank_id}`
      }), resTransformer = res => res.result
    ) {
      this.__baseRequest(API.getBanks(params), key, mapper, resTransformer);
    },
    _GetMaterials(key = "materialCode", params = {}, mapper, resTransformer) {
      this.__baseRequest(API.getMaterials(params), key, mapper ? mapper : item => {
        return {
          node: item,
          key: item.id,
          value: item.id,
          label: item.materialName
        }
      }, resTransformer);
    },
    _GetCustomers(key = "customers", params = {}, mapper, resTransformer) {
      this.__baseRequest(API.getCustomers(params), key, mapper, resTransformer);
    },
    _GetProjects(key = "projects", params = {}, mapper, resTransformer) {
      this.__baseRequest(API.getProjects(params), key, mapper, resTransformer);
    },
    _GetVendors(key = "vendors", params = {}, mapper, resTransformer) {
      this.__baseRequest(API.getVendors(params), key, mapper, resTransformer);
    },
    _GetContracts(key = "contracts", params = {}, mapper, resTransformer) {
      this.__baseRequest(API.getContracts(params), key, mapper, resTransformer);
    },
    _GetContractsItems(key = "contractItems", params = {}, mapper, resTransformer) {
      if (!params.id) return
      this.__baseRequest(API.getContract(params.id, params), key, mapper, resTransformer);
    },
    __baseReq(req, key, mapper = item => item) {
      this.__baseRequest(req, key, mapper)
    },
    __baseRequest(req, key, mapper = item => item, resTransformer = res => res.result.records) {
      if (!key) {
        return
      }
      if (req instanceof Promise) {
        req.then(res => {
          if (res.success) {
            this.FormFieldOptions = {
              ...this.FormFieldOptions,
              [key]: resTransformer(res).map(mapper)
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