import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {
  organizationModulesList,
  selectedUserData,
  userManagementClientList,
  userManagementColumnList,
  userManagementList,
  userPrivileges,
} from '../screens/Users/redux/UserManagementReducer';
import {
  clientManagement,
  clientManagementColumnList,
  clientManagementFilterList,
  syncClientWithCrm,
} from '../screens/Clients/redux/ClientReducer';
import { application } from '../screens/Application/redux/ApplicationReducer';
import { insurer } from '../screens/Insurer/redux/InsurerReducer';
import { loggedUserProfile } from '../common/Header/redux/HeaderReducer';
import { myWorkReducer } from '../screens/MyWork/redux/MyWorkReducer';
import { debtorsManagement } from '../screens/Debtors/redux/DebtorsReducer';
import { settingReducer } from '../screens/Settings/redux/SettingReducer';
import { LOGIN_REDUX_CONSTANTS } from '../screens/auth/login/redux/LoginReduxConstants';

const appReducer = combineReducers({
  loggedUserProfile,
  userPrivileges,
  userManagementColumnList,
  userManagementList,
  clientManagement,
  selectedUserData,
  organizationModulesList,
  userManagementClientList,
  clientManagementColumnList,
  clientManagementFilterList,
  syncClientWithCrm,
  application,
  insurer,
  debtorsManagement,
  myWorkReducer,
  settingReducer,
});

const rootReducer = (state, action) => {
  if (action.type === LOGIN_REDUX_CONSTANTS.LOGOUT_USER_ACTION) {
    const emptyState = {};
    Object.keys(state).forEach(key => {
      emptyState[key] = null;
    });

    storage.removeItem('persist:root');
    return emptyState;
  }

  return appReducer(state, action);
};

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['loggedUserProfile'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;
