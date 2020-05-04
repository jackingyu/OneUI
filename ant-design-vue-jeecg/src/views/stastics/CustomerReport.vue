<template>
  <page-view :pageTitle="pageTitle">
    <div slot="route-view">
      <a-row :gutter="24">
        <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
          <chart-card
            :hasFooter="false"
            :hasContent="false"
            :loading="loading"
            title="当年收款总额"
            :total="`￥${this.model.receivedAmount||0}`"
          ></chart-card>
        </a-col>
        <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
          <chart-card
            :hasFooter="false"
            :hasContent="false"
            :loading="loading"
            title="当年结算总额"
            :total="`￥${this.model.billingAmount||0}`"
          ></chart-card>
        </a-col>
        <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
          <chart-card
            :hasFooter="false"
            :hasContent="false"
            :loading="loading"
            title="上年度未开票结转"
            :total="`￥${this.model.cfUnbillingAmount||0}`"
          ></chart-card>
        </a-col>
        <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
          <chart-card
            :hasFooter="false"
            :hasContent="false"
            :loading="loading"
            title="上年度欠款结转"
            :total="`￥${this.model.cfUnreceivedAmount||0}`"
          ></chart-card>
        </a-col>
      </a-row>

      <a-card>
        <!-- table -->
        <detail-list title="销售结算">
          <SaleSettlementTable ref="table1" />
        </detail-list>
        <a-divider style="margin-top:12px" />
        <detail-list title="发票结算">
          <CustomerInvoiceTable ref="table2" />
        </detail-list>
        <a-divider style="margin-top:12px" />
        <detail-list title="收款结算">
          <CustomerReceiptTable ref="table3" />
        </detail-list>
        <a-divider style="margin-top:12px" />
      </a-card>

      <!-- fixed footer toolbar -->
      <footer-tool-bar>
        <a-button type="info" @click="back('/customer/report')">返回供应商总账报表</a-button>
      </footer-tool-bar>
    </div>
  </page-view>
</template>

<script>
import pick from 'lodash.pick'
import DetailList from '@/components/tools/DetailList'
import FooterToolBar from '@/components/tools/FooterToolBar'
import PageView from '@comp/layouts/PageView'
import SaleSettlementTable from './customerTables/SaleSettlementTable'
import CustomerReceiptTable from './customerTables/CustomerReceiptTable'
import CustomerInvoiceTable from './customerTables/CustomerInvoiceTable'
// import {
//   getVendorPayReport,
//   getVendorSettlementsReport,
//   getVendorSettlementItemReport,
//   getVendorInvoiceReport,
//   getSaleBillingReport
// } from '@/api/api'
import ChartCard from '@/components/ChartCard'
import { mapActions, mapGetters, mapState } from 'vuex'
import FormPageActionMixin from '@/mixins/FormPageActionMixin'
import moment from 'moment'
export default {
  name: 'CustomerReport',
  components: {
    ChartCard,
    PageView,
    FooterToolBar,
    DetailList,
    SaleSettlementTable,
    CustomerReceiptTable,
    CustomerInvoiceTable
  },
  mixins: [FormPageActionMixin],
  data() {
    return {
      loading: false,
      model: {}
    }
  },
  computed: {
    pageTitle() {
      return this.model.customerName
        ? `${this.model.customerName} - ${this.model.year ? this.model.year + '财年' : ''}报表明细`
        : '客户报表明细'
    }
  },
  mounted() {
    this.initModel()
  },
  activated() {
    this.initModel()
  },
  methods: {
    initModel() {
      let { year, customerId } = this.$route.query
      if (!!year && !!customerId) {
        this.model = this.$route.query || {}
        this.$loadData(year, customerId)
      }
    },
    $loadData(year, customerId) {
      this.$refs.table1.loadTable(year, customerId)
      this.$refs.table2.loadTable(year, customerId)
      this.$refs.table3.loadTable(year, customerId)
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  margin-bottom: 24px;
}
</style>