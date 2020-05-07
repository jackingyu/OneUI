<template>
  <page-view>
    <div slot="route-view">
      <a-card class="card" :bordered="false">
        <receipt-form ref="receipt" :showSubmit="false" />
        <a-divider style="margin-bottom: 32px" />
        <!-- <detail-list title="银行账号">
          <bank-form ref="bank" single :showSubmit="false" />
        </detail-list>-->
        <template>
          <a-divider style="margin-bottom: 32px" />
          <detail-list title="收款附件">
            <attach-files-form :fileScope="'80'" ref="rowfiles" :showSubmit="false" />
          </detail-list>
        </template>
      </a-card>
      <!-- table -->
      <!-- fixed footer toolbar -->
      <footer-tool-bar>
        <a-button type="info" @click="back('/sales/receipts')">返回销售收款列表</a-button>
        <a-divider type="vertical" />
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
import { getSaleReceipt, createSaleReceipt, updateSaleReceipt } from '@/api/api'
import { formItems } from './modules/formOptions'
import { mapActions, mapGetters, mapState } from 'vuex'

import AttachFilesForm from '@/views/modules/attachment/AttachFilesForm.vue'
import FormPageActionMixin from '@/mixins/FormPageActionMixin'
export default {
  name: 'Receipt',
  components: {
    PageView,
    FooterToolBar,
    ReceiptForm,
    BankForm,
    AttachFilesForm,
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
      getSaleReceipt(id).then(res => {
        if (res.success) {
          this.model = {
            ...res.result,
            id
          }
          this.$refs.receipt.edit(res.result)
          this.$refs.rowfiles.edit(res.result)
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    submitSaleReceipt(postData) {
      this.loading = true
      let promises
      postData = {
        ...postData,
        id: this.model.id
      }
      if (postData.id) {
        promises = updateSaleReceipt(postData)
      } else {
        promises = createSaleReceipt(postData)
      }
      promises
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
            // paymentDate: values.paymentDate + ' 00:00:00'
          }
          delete postData.accounts
          that.$refs.rowfiles.form.validateFields((errrr, files) => {
            if (!errrr) {
              let arData = []
              if (!(files.data instanceof Array)) {
                try {
                  arData = JSON.parse(files.data)
                } catch (error) {
                  arData = []
                }
              } else {
                arData = files.data
              }
              arData.forEach(element => {
                element.ossFileId = element.id
                delete element.key
                delete element.id
              })
              postData.attachments = arData
            }
            that.submitSaleReceipt(postData)
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