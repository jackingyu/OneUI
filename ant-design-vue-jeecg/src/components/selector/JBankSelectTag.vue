<template>
  <a-select
    v-if="async"
    showSearch
    :disabled="disabled"
    @search="loadData"
    :placeholder="placeholder"
    v-model="selectedAsyncValue"
    style="width: 100%"
    :filterOption="false"
    @change="handleAsyncChange"
    allowClear
    :notFoundContent="loading ? undefined : null"
  >
    <a-spin v-if="loading" slot="notFoundContent" size="small" />
    <a-select-option v-for="d in options" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
  </a-select>

  <a-select
    v-else
    showSearch
    :disabled="disabled"
    :placeholder="placeholder"
    optionFilterProp="children"
    style="width: 100%"
    @change="handleChange"
    :filterOption="filterOption"
    v-model="selectedValue"
    allowClear
    :notFoundContent="loading ? undefined : null"
  >
    <a-spin v-if="loading" slot="notFoundContent" size="small" />
    <a-select-option v-for="d in options" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
  </a-select>
</template>

<script>
import { getBanks, getSubBanks } from '@/api/api'
import debounce from 'lodash/debounce'
import { getAction } from '@/api/manage'

export default {
  name: 'JBankSelectTag',
  props: {
    master: {
      type: Boolean,
      default: true
    },
    disabled: Boolean,
    value: {
      type: String,
      default: '',
      required: false
    },
    searchWord: String,
    dict: String,
    dictOptions: Array,
    async: Boolean,
    placeholder: {
      type: String,
      default: '请选择',
      required: false
    }
  },
  data() {
    this.loadData = debounce(this.loadData, 800) //消抖
    this.lastLoad = 0
    return {
      loading: false,
      selectedValue: void 0,
      selectedAsyncValue: void 0,
      options: []
    }
  },
  created() {
    this.initDictData()
    window.T = this
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        if (!val) {
          this.selectedValue = []
          this.selectedAsyncValue = []
        } else {
          this.initSelectValue()
        }
      }
    },
    dict: {
      handler() {
        this.initDictData()
      }
    },
    searchWord: {
      immediate: false,
      handler(val) {
        this.loadData(val || '')
      }
    },
    dictOptions: {
      handler(val) {
        // this.options = this.dictOptions
      }
    }
  },
  methods: {
    initSelectValue() {
      if (this.async) {
        this.selectedAsyncValue = this.value
      } else {
        this.selectedValue = this.value
      }
    },
    loadData(value) {
      this.lastLoad += 1
      const currentLoad = this.lastLoad
      this.options = []
      this.loading = true
      if (this.master) {
        getBanks().then(res => {
          if (res.success) {
            this.options = res.result.map(item => {
              return {
                text: item.bank_name,
                title: item.bank_name,
                value: `${item.bank_id}`
              }
            })
          } else {
            this.$message.warning(res.message)
          }
        })
      } else {
        console.log('w(ﾟДﾟ)w 🔥 🔥 🔥数据加载', value)
        if (this.dict && /^[\u4e00-\u9fa5]{1,}/.test(value)) {
          getSubBanks(this.dict, { subbranchName: value }).then(res => {
            if (res.success) {
              this.options = res.result.map(item => {
                return {
                  text: item.sub_branch_name,
                  title: item.sub_branch_name,
                  value: `${item.sub_branch_id}`
                }
              })
            } else {
              this.$message.warning(res.message)
            }
          })
        }
      }
    },
    initDictData() {
      if (!this.async) {
        console.log('initDictData🔥数据加载')
        //如果字典项集合有数据
        if (this.dictOptions && this.dictOptions.length > 0) {
          this.options = [...this.dictOptions]
        } else {
          //根据字典Code, 初始化字典数组
          if (this.master) {
            const currentLoad = this.lastLoad
            getBanks().then(res => {
              if (res.success) {
                if (currentLoad != this.lastLoad) {
                  return
                }
                this.options = res.result.map(item => {
                  return {
                    text: item.bank_name,
                    title: item.bank_name,
                    value: `${item.bank_id}`
                  }
                })
              } else {
                this.$message.warning(res.message)
              }
            })
          }
        }
      } else {
        this.loadData(this.searchWord || '')
      }
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    handleChange(selectedValue) {
      this.selectedValue = selectedValue
      this.callback()
    },
    handleAsyncChange(selectedObj) {
      this.selectedValue = selectedObj
      this.selectedAsyncValue = selectedObj
      this.callback()
    },
    callback() {
      this.$emit('change', this.selectedValue)
    },
    setCurrentDictOptions(dictOptions) {
      this.options = dictOptions
    },
    getCurrentDictOptions() {
      return this.options
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  }
}
</script>