<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="8" :sm="12">
            <a-form-item label="供应商名称">
              <j-input placeholder="材料商或者分包商名称" v-model="queryParam.vendorName"></j-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label>
              <!-- <a-select v-model="queryParam.materialGroupCode" placeholder="请选择物料组">
                <a-select-option value>请选择</a-select-option>
                <a-select-option
                  v-for="(item, index) in materialGroups"
                  :key="index"
                  :value="item.materialGroupCode"
                >{{item.materialGroupName}}</a-select-option>
              </a-select>-->
              <j-dict-select-tag
                v-model="queryParam.vendorCode"
                placeholder="请选择材料商或者分包商"
                dictCode="vendor_group"
              />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button
                type="primary"
                @click="searchReset"
                icon="reload"
                style="margin-left: 8px"
              >重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator" style="border-top: 5px">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
    </div>

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
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <!-- <a-divider type="vertical" /> -->
          <a-dropdown v-if="false">
            <a class="ant-dropdown-link">
              更多
              <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->
    <material-modal ref="modalForm" @ok="modalFormOk"></material-modal>
  </a-card>
</template>

<script>
import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
import MaterialModal from './modules/MaterialModal'
import { putAction } from '@/api/manage'
import { createMaterial, updateMaterial, frozenBatch } from '@/api/api'
import Rest from '@/config/api-mapper.js'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import JInput from '@/components/jeecg/JInput'

export default {
  name: 'Supplier',
  mixins: [JeecgListMixin],
  components: {
    MaterialModal,
    JInput
  },
  data() {
    return {
      description: '这是用户管理页面',
      queryParam: {},
      materialGroups: [],
      oneTimeFlags: [],
      columns: [
        /*{
            title: '#',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },*/
        {
          title: '供应商代码',
          align: 'center',
          width: 100,
          dataIndex: 'vendorCode'
        },
        {
          title: '供应商名称',
          align: 'center',
          width: 100,
          dataIndex: 'vendorName'
        },
        {
          title: '供应商分组',
          align: 'center',
          dataIndex: 'vendorGroupCode',
          width: 120,
          customRender: text => {
            return filterDictText(this.materialGroups, text) || text
          }
        },
        {
          title: '联络人',
          align: 'center',
          width: 100,
          dataIndex: 'contactPerson'
        },
        {
          title: '联络手机',
          align: 'center',
          width: 100,
          dataIndex: 'contactPhone'
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          align: 'center',
          width: 170
        }
      ],
      url: {
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
        list: Rest.GET_SUPPLIERS.url
      }
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    initDictConfig() {
      initDictOptions('material_group').then(res => {
        if (res.success) {
          this.materialGroups = res.result
        }
      })
      initDictOptions('material_property').then(res => {
        if (res.success) {
          this.oneTimeFlags = res.result
        }
      })
    },
    handleEdit(record) {
      this.$router.push({
        path: '/masterdata/supplier-info',
        query: {
          id: record.id
        }
      })
    },
    handleAdd() {
      this.$router.push({ path: '/masterdata/supplier-info' })
    },
    handleDelete(id) {}
  }
}
</script>
<style lang="scss" scoped>
@import '~@assets/less/common.less';
</style>
