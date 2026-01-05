import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./slices/userSlice";
import documentsReducer from "./slices/documentHistorySlice"; 



// configure persistence
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "organizations"],
};

// combine reducers
const rootReducer = combineReducers({
  user: userReducer,
  documentHistory: documentsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

