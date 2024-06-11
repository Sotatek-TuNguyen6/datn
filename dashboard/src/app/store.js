import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userReducers from '../features/userSlide/userSlide'
import productsReducers from '../features/productSlide/productSlice'
import ordersReducers from '../features/Order/Order'
import productSingleReducers from '../features/productSlide/ProductSliceNew'

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  // backlist: ['user']

}

const rootReducer = combineReducers({
    user: userReducers,
    products:productsReducers,
    orders:ordersReducers,
    ProductSignle:productSingleReducers
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export let persistor = persistStore(store)