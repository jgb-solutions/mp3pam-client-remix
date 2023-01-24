import webStorage from 'redux-persist/lib/storage'
import { createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2'

import { combineReducers } from 'redux'
import playerReducer from './reducers/playerReducer'

import type { PersistConfig } from 'redux-persist'

const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null)
    },
    setItem(_key: string, value: string) {
      return Promise.resolve(value)
    },
    removeItem(_key: string) {
      return Promise.resolve()
    },
  }
}

const storage = typeof window === 'undefined' ? createNoopStorage() : webStorage

const rootReducer = combineReducers({
  player: playerReducer,
})

const persistConfig: PersistConfig = {
  key: `v_01_01_2022_001`,
  storage,
  whitelist: ['player'],
  // timeout: 0,
  // stateReconciler: autoMergeLevel2
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const persistedStore = () => {
  let store = createStore(persistedReducer)
  let persistor = persistStore(store)
  return { store, persistor }
}

// import logger from 'redux-logger'
// import { combineReducers } from 'redux'
// import storage from 'redux-persist/lib/storage'
// import { configureStore } from '@reduxjs/toolkit'
// import { persistStore, persistReducer } from 'redux-persist'
// import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'

// import authReducer from './reducers/auth-reducer'
// import eligibilitiesReducer from './reducers/eligibilities-reducer'

// const persistConfig = {
// 	key: 'admin_store_v_0.0.1',
// 	storage,
// 	whitelist: ['auth'],
// 	stateReconciler: autoMergeLevel2,
// }

// const middleware = []

// export const rootReducer = combineReducers({
// 	auth: authReducer,
// 	eligibilities: eligibilitiesReducer,
// })

// // use redux-logger only in development
// if (process.env.NODE_ENV === 'development') {
// 	middleware.push(logger)
// }

// const persistedReducer = persistReducer(persistConfig, rootReducer)

// export const adminSore = configureStore({
// 	reducer: persistedReducer,
// 	middleware: (getDefaultMiddleware) =>
// 		getDefaultMiddleware({
// 			// serializableCheck: {
// 			//   ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
// 			// },
// 		}).concat(middleware),
// })
// export const persistor = persistStore(adminSore)

// import { UpdateEligibilityQueryDocument } from './../../graphql/mutations'
// import { AdminRootState } from './../../interfaces/AdminInterfaces'
// import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'

// import { getGRClient } from '../../../graphql/clients'
// import {
// 	FetchEligibilitiesQuery,
// 	UpdateEligibilityMutationVariables,
// 	UpdateEligibilityMutation,
// } from './../../../graphql/graphql-client-types'
// import { FetchEligibilitiesQueryDocument } from './../../graphql/queries'

// export const getEligibilities = createAsyncThunk(
// 	'Admin/get-eligibilities',
// 	async (param = null, { getState }) => {
// 		const state = getState() as AdminRootState
// 		const token = state.auth.admin.token
// 		return await getGRClient(token).request<FetchEligibilitiesQuery>(
// 			FetchEligibilitiesQueryDocument
// 		)
// 	}
// )

// export const updateEligibility = createAsyncThunk(
// 	'Admin/update-eligibility',
// 	async (updatedData: UpdateEligibilityMutationVariables, { getState }) => {
// 		const state = getState() as AdminRootState
// 		const token = state.auth.admin.token
// 		return await getGRClient(token).request<
// 			UpdateEligibilityMutation,
// 			UpdateEligibilityMutationVariables
// 		>(UpdateEligibilityQueryDocument, updatedData)
// 	}
// )

// const initialState = {
// 	data: {} as FetchEligibilitiesQuery['eligibilities'],
// 	loading: false,
// 	error: false,
// }

// const EligibilitiesSlice = createSlice({
// 	name: 'Eligibilities',
// 	initialState,
// 	reducers: {},
// 	extraReducers: (builder) => {
// 		// Get Eligibilities
// 		builder.addCase(getEligibilities.pending, (state) => {
// 			state.loading = true
// 		})

// 		builder.addCase(
// 			getEligibilities.fulfilled,
// 			(state, action: PayloadAction<FetchEligibilitiesQuery>) => {
// 				state.data = action.payload.eligibilities
// 				state.loading = false
// 			}
// 		)

// 		builder.addCase(getEligibilities.rejected, (state) => {
// 			state.loading = false
// 		})

// 		// Update Eligibility
// 		builder.addCase(updateEligibility.pending, (state) => {
// 			state.loading = true
// 		})

// 		builder.addCase(
// 			updateEligibility.fulfilled,
// 			(state, action: PayloadAction<UpdateEligibilityMutation>) => {
// 				state.loading = false
// 				window.location.reload()
// 			}
// 		)

// 		builder.addCase(updateEligibility.rejected, (state) => {
// 			state.loading = false
// 		})
// 	},
// })

// export default EligibilitiesSlice.reducer
