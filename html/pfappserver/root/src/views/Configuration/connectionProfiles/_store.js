/**
* "$_connection_profiles" store module
*/
import Vue from 'vue'
import { computed } from '@vue/composition-api'
import i18n from '@/utils/locale'
import api from './_api'

export const useStore = $store => {
  return {
    isLoading: computed(() => $store.getters['$_connection_profiles/isLoading']),
    getList: () => $store.dispatch('$_connection_profiles/all'),
    getListOptions: () => $store.dispatch('$_connection_profiles/options'),
    createItem: params => $store.dispatch('$_connection_profiles/createConnectionProfile', params),
    sortItems: params => $store.dispatch('$_connection_profiles/sortConnectionProfiles', params.items),
    getItem: params => $store.dispatch('$_connection_profiles/getConnectionProfile', params.id).then(item => {
      return (params.isClone)
        ? { ...item, id: `${item.id}-${i18n.t('copy')}`, not_deletable: false }
        : item
    }),
    getItemOptions: params => $store.dispatch('$_connection_profiles/options', params.id),
    updateItem: params => $store.dispatch('$_connection_profiles/updateConnectionProfile', params),
    deleteItem: params => $store.dispatch('$_connection_profiles/deleteConnectionProfile', params.id),
  }
}

const types = {
  LOADING: 'loading',
  DELETING: 'deleting',
  SUCCESS: 'success',
  ERROR: 'error'
}

// Default values
const state = () => {
  return {
    cache: {}, // items details
    message: '',
    itemStatus: '',
    files: {
      message: '',
      status: '',
      cache: {}
    }
  }
}

const getters = {
  isWaiting: state => [types.LOADING, types.DELETING].includes(state.itemStatus),
  isLoading: state => state.itemStatus === types.LOADING,
  isWaitingFiles: state => [types.LOADING, types.DELETING].includes(state.files.status),
  isLoadingFiles: state => state.files.status === types.LOADING
}

const actions = {
  all: () => {
    const params = {
      sort: 'id',
      fields: ['id'].join(',')
    }
    return api.list(params).then(response => {
      return response.items
    })
  },
  options: ({ commit }, id) => {
    commit('ITEM_REQUEST')
    if (id) {
      return api.itemOptions(id).then(response => {
        commit('ITEM_SUCCESS')
        return response
      }).catch((err) => {
        commit('ITEM_ERROR', err.response)
        throw err
      })
    } else {
      return api.listOptions().then(response => {
        commit('ITEM_SUCCESS')
        return response
      }).catch((err) => {
        commit('ITEM_ERROR', err.response)
        throw err
      })
    }
  },
  getConnectionProfile: ({ state, commit }, id) => {
    if (state.cache[id]) {
      return Promise.resolve(state.cache[id])
    }
    commit('ITEM_REQUEST')
    return api.item(id).then(item => {
      commit('ITEM_REPLACED', item)
      return state.cache[id]
    }).catch((err) => {
      commit('ITEM_ERROR', err.response)
      throw err
    })
  },
  createConnectionProfile: ({ commit }, data) => {
    commit('ITEM_REQUEST')
    return api.create(data).then(response => {
      commit('ITEM_REPLACED', data)
      return response
    }).catch(err => {
      commit('ITEM_ERROR', err.response)
      throw err
    })
  },
  updateConnectionProfile: ({ commit }, data) => {
    commit('ITEM_REQUEST')
    return api.update(data).then(response => {
      commit('ITEM_REPLACED', data)
      return response
    }).catch(err => {
      commit('ITEM_ERROR', err.response)
      throw err
    })
  },
  deleteConnectionProfile: ({ commit }, data) => {
    commit('ITEM_REQUEST', types.DELETING)
    return api.delete(data).then(response => {
      commit('ITEM_DESTROYED', data)
      return response
    }).catch(err => {
      commit('ITEM_ERROR', err.response)
      throw err
    })
  },
  sortConnectionProfiles: ({ commit }, data) => {
    const params = {
      items: data
    }
    commit('ITEM_REQUEST', types.LOADING)
    return api.sort(params).then(response => {
      commit('ITEM_SUCCESS')
      return response
    }).catch(err => {
      commit('ITEM_ERROR', err.response)
      throw err
    })
  },
  enableConnectionProfile: ({ commit }, data) => {
    commit('ITEM_REQUEST')
    const _data = { id: data.id, status: 'enabled' }
    return api.update(_data).then(response => {
      commit('ITEM_ENABLED', data)
      return response
    }).catch(err => {
      commit('ITEM_ERROR', err.response)
      throw err
    })
  },
  disableConnectionProfile: ({ commit }, data) => {
    commit('ITEM_REQUEST')
    const _data = { id: data.id, status: 'disabled' }
    return api.update(_data).then(response => {
      commit('ITEM_DISABLED', data)
      return response
    }).catch(err => {
      commit('ITEM_ERROR', err.response)
      throw err
    })
  },
  files: ({ commit }, data) => {
    const sort = 'sort' in data ? data.sort.join(',') : 'type,name'
    const params = {
      id: data.id,
      sort,
      fields: ['name', 'size', 'entries', 'type', 'not_deletable', 'not_revertible'].join(',')
    }
    commit('FILE_REQUEST')
    return api.files(params).then(response => {
      const _walk = (item, path) => {
        Object.assign(item, { path })
        if ('entries' in item) {
          item.entries.forEach(entry => _walk(entry, path ? [path, item.name].join('/') : item.name))
        }
      }
      response.entries.forEach(item => _walk(item, ''))
      commit('FILE_REPLACED', { id: data.id, files: response })
      return response
    })
  },
  getFile: ({ state, commit, dispatch }, params) => {
    commit('FILE_REQUEST')
    return api.file(params).then(content => {
      // Retrieve metadata ..
      let filePromise
      if (state.files.cache[params.id]) {
        // .. from cache
        filePromise = Promise.resolve(state.files.cache[params.id])
      } else {
        // .. from server
        filePromise = dispatch('files', { id: params.id })
      }
      return filePromise.then(() => {
        let paths = params.filename.split('/')
        let meta = state.files.cache[params.id]
        for (let path of paths) {
          if (path) {
            if (meta && 'entries' in meta) {
              meta = meta.entries.find(item => item.name === path)
            }
          }
        }
        commit('FILE_SUCCESS')
        return { meta, content }
      })
    }).catch((err) => {
      commit('FILE_ERROR', err.response)
      throw err
    })
  },
  createFile: ({ commit }, data) => {
    commit('FILE_REQUEST')
    return api.createFile(data).then(response => {
      commit('FILE_SUCCESS', data)
      return response
    }).catch(err => {
      commit('FILE_ERROR', err.response)
      throw err
    })
  },
  updateFile: ({ commit }, data) => {
    commit('FILE_REQUEST')
    return api.updateFile(data).then(response => {
      commit('FILE_SUCCESS', data)
      return response
    }).catch(err => {
      commit('FILE_ERROR', err.response)
      throw err
    })
  },
  deleteFile: ({ commit, dispatch }, params) => {
    commit('FILE_REQUEST', types.DELETING)
    return api.deleteFile(params).then(() => {
      commit('FILE_DESTROYED')
      return dispatch('files', { id: params.id })
    }).catch(err => {
      commit('FILE_ERROR', err.response)
      throw err
    })
  }
}

const mutations = {
  ITEM_REQUEST: (state, type) => {
    state.itemStatus = type || types.LOADING
    state.message = ''
  },
  ITEM_REPLACED: (state, data) => {
    state.itemStatus = types.SUCCESS
    Vue.set(state.cache, data.id, data)
  },
  ITEM_ENABLED: (state, data) => {
    state.itemStatus = types.SUCCESS
    Vue.set(state.cache, data.id, { ...state.cache[data.id], ...data })
  },
  ITEM_DISABLED: (state, data) => {
    state.itemStatus = types.SUCCESS
    Vue.set(state.cache, data.id, { ...state.cache[data.id], ...data })
  },
  ITEM_DESTROYED: (state, id) => {
    state.itemStatus = types.SUCCESS
    Vue.set(state.cache, id, null)
  },
  ITEM_ERROR: (state, response) => {
    state.itemStatus = types.ERROR
    if (response && response.data) {
      state.message = response.data.message
    }
  },
  ITEM_SUCCESS: (state) => {
    state.itemStatus = types.SUCCESS
  },
  FILE_REQUEST: (state, type) => {
    state.files.status = type || types.LOADING
    state.files.message = ''
  },
  FILE_SUCCESS: (state) => {
    state.files.status = types.SUCCESS
  },
  FILE_REPLACED: (state, data) => {
    state.files.status = types.SUCCESS
    Vue.set(state.files.cache, data.id, data.files)
  },
  FILE_DESTROYED: (state) => {
    state.files.status = types.SUCCESS
  },
  FILE_ERROR: (state, response) => {
    state.files.status = types.ERROR
    if (response && response.data) {
      state.files.message = response.data.message
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
