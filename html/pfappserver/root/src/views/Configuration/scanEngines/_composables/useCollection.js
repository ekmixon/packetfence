import { computed, toRefs } from '@vue/composition-api'
import i18n from '@/utils/locale'

export const useItemProps = {
  id: {
    type: String
  },
  scanType: {
    type: String
  }
}

import { useDefaultsFromMeta } from '@/composables/useMeta'
export const useItemDefaults = (meta, props) => {
  const {
    scanType
  } = toRefs(props)
  return { ...useDefaultsFromMeta(meta), type: scanType.value }
}

export const useItemTitle = (props) => {
  const {
    id,
    isClone,
    isNew
  } = toRefs(props)
  return computed(() => {
    switch (true) {
      case !isNew.value && !isClone.value:
        return i18n.t('Scan Engine <code>{id}</code>', { id: id.value })
      case isClone.value:
        return i18n.t('Clone Scan Engine <code>{id}</code>', { id: id.value })
      default:
        return i18n.t('New Scan Engine')
    }
  })
}

export const useItemTitleBadge = (props, context, form) => {
  const {
    scanType
  } = toRefs(props)
  return computed(() => {
    const { type = scanType.value } = form.value || {}
    return type
  })
}

export { useRouter } from '../_router'

export { useStore } from '../_store'

import { pfSearchConditionType as conditionType } from '@/globals/pfSearch'
import makeSearch from '@/store/factory/search'
import api from '../_api'
export const useSearch = makeSearch('scanEngines', {
  api,
  columns: [
    {
      key: 'selected',
      thStyle: 'width: 40px;', tdClass: 'text-center',
      locked: true
    },
    {
      key: 'id',
      label: 'Name', // i18n defer
      required: true,
      searchable: true,
      sortable: true,
      visible: true
    },
    {
      key: 'ip',
      label: 'IP Address', // i18n defer
      searchable: true,
      sortable: true,
      visible: true
    },
    {
      key: 'port',
      label: 'Port', // i18n defer
      searchable: true,
      sortable: true,
      visible: true
    },
    {
      key: 'type',
      label: 'Type', // i18n defer
      searchable: true,
      sortable: true,
      visible: true
    },
    {
      key: 'buttons',
      class: 'text-right p-0',
      locked: true
    }
  ],
  fields: [
    {
      value: 'id',
      text: i18n.t('Name'),
      types: [conditionType.SUBSTRING]
    },
    {
      value: 'ip',
      text: i18n.t('IP Address'),
      types: [conditionType.SUBSTRING]
    },
    {
      value: 'port',
      text: i18n.t('Port'),
      types: [conditionType.SUBSTRING]
    },
    {
      value: 'type',
      text: i18n.t('Type'),
      types: [conditionType.SUBSTRING]
    }
  ],
  sortBy: 'id'
})
