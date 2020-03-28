<template>
  <page-view>
    <div slot="route-view">
      <a-card class="card" :bordered="false">
        <receipt-form ref="contract" :showSubmit="false" />
        <a-divider style="margin-bottom: 32px" />
        <detail-list title="银行账号">
          <bank-form ref="bank" single :showSubmit="false" />
        </detail-list>
      </a-card>
      <!-- table -->
      <!-- fixed footer toolbar -->
      <footer-tool-bar>
        <a-button type="primary" @click="validate" :loading="loading">提交</a-button>
        <!-- <a-divider type="vertical" />
        <a-button type="info" @click="validate" :loading="loading">暂存</a-button>-->
      </footer-tool-bar>
    </div>
  </page-view>
</template>

<script>
import pick from 'lodash.pick'

import BankForm from './modules/form/BankForm'
import DetailList from '@/components/tools/DetailList'
import ReceiptForm from './modules/form/ReceiptForm'
import FooterToolBar from '@/components/tools/FooterToolBar'
import JBankSelectTag from '@/components/selector/JBankSelectTag'
import PageView from '@comp/layouts/PageView'
import { getContracts, createContract, updateContract } from '@/api/api'
import { formItems } from './modules/formOptions'
import { mapActions, mapGetters, mapState } from 'vuex'
export default {
  name: 'Receipt',
  components: {
    PageView,
    FooterToolBar,
    ReceiptForm,
    BankForm,
    DetailList
  },
  data() {
    return {
      cType: '',
      loading: false,
      rowFields: []
    }
  },
  computed: {
    orgCode() {
      return this.userInfo().orgCode
    }
  },
  mounted() {
    this.initModel()
  },
  created() {
    window.TT = this
  },
  methods: {
    ...mapGetters(['userInfo']),
    initModel() {
      // let { id = undefined } = this.$route.query
      // if (id) {
      //   getContracts(id).then(res => {
      //     if (res.success) {
      //       this.$refs.contract.edit(res.result)
      //       this.$refs.rowproj.edit(res.result.bankAccounts)
      //     } else {
      //       this.$message.warning(res.message)
      //     }
      //   })
      // } else {
      //   this.$refs.contract.add()
      // }
    },
    contractChange(v) {
      this.cType = v
      this.rowFields = formItems.filter(item => !item.contractType || item.contractType == v)
      this.$refs.rowproj.contract(v)
    },
    submitContract(postData) {
      this.loading = true
      let promises
      if (postData.id) {
        promises = updateContract(postData)
      } else {
        promises = createContract(postData)
      }
      promises
        .then(res => {
          if (res.success) {
            this.$message.success(res.message)
          } else {
            this.$message.warning(res.message)
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 最终全页面提交
    validate() {
      let that = this
      that.$refs.contract.form.validateFields((err, values) => {
        console.info('contract', values)
        if (!err) {
          let postData = pick(
            values,
            'id',
            'contractTitle',
            'contractCode',
            'projectId',
            'contractTypeCode',
            'vendorId',
            'contactPerson',
            'contactPhone'
          )
          let spans = values.dateSpan.map(item => item.format('YYYY-MM-DD HH:mm:ss'))
          postData.beginDate = spans[0]
          postData.endDate = spans[1]
          that.$refs.rowproj.form.validateFields((err, values) => {
            if (!err) {
              let arData = []
              if (!(values.data instanceof Array)) {
                try {
                  arData = JSON.parse(values.data)
                } catch (error) {
                  arData = []
                }
              } else {
                arData = values.data
              }
              arData.forEach(element => {
                delete element.key
              })
              let typeFields = that.rowFields
              let fields = typeFields.filter(item => !item.justShow).map(item => item.valueKey)
              let childFields =
                typeFields.filter(item => !!item.suffix || !!item.prefix).map(item => item.valueKey) || []
              fields = fields.concat(childFields)
              for (let i = 0; i < arData.length; i++) {
                let rowData = arData[i]
                let inValidField = fields.find(item => !rowData[item])
                if (inValidField) {
                  let jRow = typeFields.find(item => item.valueKey == inValidField)
                  that.$message.error(`请检查行项目【${jRow.label}】是否填写完整`)
                  return
                }
              }
              postData.purchaseContractItems = arData
              that.submitContract(postData)
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  margin-bottom: 24px;
}
</style>