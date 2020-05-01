<template>
  <page-view>
    <div slot="route-view">
      <a-card class="card" :bordered="false">
        <company-form ref="receipt" :showSubmit="false" />
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
import CompanyForm from './modules/form/CompanyForm'
import FooterToolBar from '@/components/tools/FooterToolBar'
import JBankSelectTag from '@/components/selector/JBankSelectTag'
import PageView from '@comp/layouts/PageView'
import { updateCompany, getCompany } from '@/api/api'
import { formItems } from './modules/formOptions'
import { mapActions, mapGetters, mapState } from 'vuex'

import FormPageActionMixin from '@/mixins/FormPageActionMixin'
export default {
  name: 'Company',
  components: {
    PageView,
    FooterToolBar,
    CompanyForm,
    BankForm,
    DetailList
  },
  mixins: [FormPageActionMixin],
  data() {
    return {
      cType: '',
      loading: false,
      rowFields: [],
      model: {}
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
      let { id = undefined } = this.$route.query
      if (id) {
        this.$loadData(id)
      } else {
        this.$refs.receipt.add()
      }
    },
    $loadData(id) {
      getCompany(id).then(res => {
        if (res.success) {
          this.model = {
            ...res.result,
            id
          }
          this.$refs.receipt.edit(res.result)
          this.$refs.bank.edit(res.result.bankAccounts)
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    submitCompany(postData) {
      this.loading = true
      let promises
      postData = {
        ...this.model,
        ...postData
      }
      updateCompany(postData)
        .then(res => {
          if (res.success) {
            if (res.result.id && !this.model.id) {
              this.closePathFreshDetail(res.result.id)
            }
            this.$loadData(res.result.id)
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
      that.$refs.receipt.form.validateFields((err, values) => {
        if (!err) {
          let postData = {
            ...values
          }
          that.$refs.bank.form.validateFields((err, values) => {
            if (!err) {
              let arData = []
              if (!(values.data instanceof Array)) {
                try {
                  arData = JSON.parse(values.data)
                } catch (error) {
                  arData = []
                }
              } else {
                arData = values.data || []
              }
              let banks = arData.map(item => {
                return pick(item, 'id', 'bankAccount', 'bankAccountName', 'bankId', 'subBranchId')
              })
              postData.bankAccounts = banks
              that.submitCompany(postData)
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