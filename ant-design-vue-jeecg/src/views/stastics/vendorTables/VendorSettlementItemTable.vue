<template>
  <!-- table区域-begin -->
  <div>
    <a-table
      ref="table"
      bordered
      size="middle"
      rowKey="id"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="ipagination"
      :loading="loading"
      @change="handleTableChange"
    >
      <template slot="goToContractItem" slot-scope="text, record, index">
        <a
          :href="`/purchase/settlement?id=${record.vendorSettlementId}`"
          style="width:80px"
        >{{record.vendorSettlementId}}</a>
      </template>
    </a-table>
  </div>
  <!-- table区域-end -->
</template>

<script>
import { putAction } from '@/api/manage'
import Rest, { sloter } from '@/config/api-mapper.js'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import JInput from '@/components/jeecg/JInput'

//供应商付款表
export default {
  name: 'VendorSettlementItemTable',
  mixins: [JeecgListMixin],
  components: {
    JInput
  },
  data() {
    return {
      description: '',
      queryParam: {},
      materialGroups: [],
      oneTimeFlags: [],
      columns: [
        {
          title: '行项目编号',
          align: 'center',
          dataIndex: 'contractItemNo'
        },
        {
          title: '结算单编号',
          align: 'center',
          dataIndex: 'vendorSettlementId',
          scopedSlots: { customRender: 'goToContractItem' }
        },
        {
          title: '合同内容',
          align: 'center',
          dataIndex: 'contractContent'
        },
        {
          title: '项目名称',
          align: 'center',
          dataIndex: 'projectId_dictText'
        },
        {
          title: '物料名称',
          align: 'center',
          dataIndex: 'materialId_dictText'
        },
        {
          title: '数量',
          align: 'center',
          dataIndex: 'quantity'
        },
        {
          title: '单价',
          align: 'center',
          dataIndex: 'unitPrice'
        },
        {
          title: '单位',
          align: 'center',
          dataIndex: 'unitCode_dictText'
        },
        {
          title: '结算总价',
          align: 'center',
          dataIndex: 'totalAmount'
        }
      ],
      url: {
        list: 0
      }
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    loadTable(year, customerId) {
      this.url.list = sloter(Rest.GET_VENDOR_SETTLEMENTS_ITEM_REPORT.url, year, customerId)
      this.loadData()
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@assets/less/common.less';
</style>
