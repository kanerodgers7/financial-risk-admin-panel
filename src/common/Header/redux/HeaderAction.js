import { displayErrors } from '../../../helpers/ErrorNotifyHelper';
import { LOGIN_REDUX_CONSTANTS } from '../../../screens/auth/login/redux/LoginReduxConstants';
import { MY_WORK_REDUX_CONSTANTS } from '../../../screens/MyWork/redux/MyWorkReduxConstants';
import {
  startGeneralLoaderOnRequest,
  stopGeneralLoaderOnSuccessOrFail,
} from '../../GeneralLoader/redux/GeneralLoaderAction';
import { errorNotification, successNotification } from '../../Toast';
import HeaderApiService from '../services/HeaderApiService';
import {
  EDIT_PROFILE_CONSTANT,
  HEADER_GLOBAL_SEARCH_REDUX_CONSTANTS,
  HEADER_NOTIFICATION_REDUX_CONSTANTS,
} from './HeaderConstants';

export const changePassword = async (oldPassword, newPassword) => {
  try {
    startGeneralLoaderOnRequest('changePasswordHeaderButtonLoaderAction');
    const data = { oldPassword, newPassword };
    const response = await HeaderApiService.changePassword(data);

    if (response?.data?.status === 'SUCCESS') {
      successNotification(
        response?.data?.message ||
          'You have been logged out to every device aa you changed password'
      );
      // successNotification(response?.data?.message || 'Password changed successfully.');
      stopGeneralLoaderOnSuccessOrFail('changePasswordHeaderButtonLoaderAction');
    }
  } catch (e) {
    stopGeneralLoaderOnSuccessOrFail('changePasswordHeaderButtonLoaderAction');
    displayErrors(e);
    throw Error();
  }
};

export const getLoggedUserDetails = () => {
  return async dispatch => {
    try {
      const response = await HeaderApiService.loggedUserDetails();
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: EDIT_PROFILE_CONSTANT.GET_LOGGED_USER_DETAILS,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const changeEditProfileData = data => {
  return async dispatch => {
    dispatch({
      type: EDIT_PROFILE_CONSTANT.USER_EDIT_PROFILE_DATA_CHANGE,
      data,
    });
  };
};

export const updateUserProfile = (name, contactNumber) => {
  return async dispatch => {
    startGeneralLoaderOnRequest('updateProfileHeaderButtonLoaderAction');
    try {
      const data = {
        name,
        contactNumber,
      };
      const response = await HeaderApiService.updateUserProfile(data);
      if (response?.data?.status === 'SUCCESS') {
        successNotification(response?.data?.message || 'Profile updated successfully');
        dispatch(getLoggedUserDetails());
        stopGeneralLoaderOnSuccessOrFail('updateProfileHeaderButtonLoaderAction');
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('updateProfileHeaderButtonLoaderAction');
      displayErrors(e);
      throw Error();
    }
  };
};
export const uploadProfilePicture = (data, config) => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest('updateProfileHeaderButtonLoaderAction');

      const response = await HeaderApiService.uploadUserProfilePicture(data, config);
      if (response?.data?.status === 'success') {
        dispatch({
          type: EDIT_PROFILE_CONSTANT.UPDATE_USER_PROFILE_PICTURE,
          data: response.data.data,
        });
        successNotification(response?.data?.message || 'Profile picture updated successfully');
        stopGeneralLoaderOnSuccessOrFail('updateProfileHeaderButtonLoaderAction');
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('updateProfileHeaderButtonLoaderAction');
      displayErrors(e);
      throw Error();
    }
  };
};
export const logoutUser = () => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest('logoutHeaderButtonLoaderAction');

      const response = await HeaderApiService.logoutUser();

      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: LOGIN_REDUX_CONSTANTS.LOGOUT_USER_ACTION,
        });
        successNotification(response?.data?.message || 'Logged out successfully.');
        stopGeneralLoaderOnSuccessOrFail('logoutHeaderButtonLoaderAction');
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('logoutHeaderButtonLoaderAction');
      displayErrors(e);
    }
  };
};

export const getHeaderNotificationListURL = page => {
  return async dispatch => {
    try {
      const response = await HeaderApiService.notificationApiServices.getHeaderNotificationList(
        page
      );
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: HEADER_NOTIFICATION_REDUX_CONSTANTS.GET_HEADER_NOTIFICATION,
          data: response?.data?.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const updateHeaderNotificationOnNewNotificationAction = data => {
  return dispatch => {
    dispatch({
      type: HEADER_NOTIFICATION_REDUX_CONSTANTS.ADD_NOTIFICATION,
      data,
    });
    dispatch({
      type: MY_WORK_REDUX_CONSTANTS.MY_WORK_NOTIFICATION_REDUX_CONSTANTS
        .GET_NOTIFICATION_FROM_SOCKET,
      data,
    });
  };
};

export const markNotificationAsReadAndDeleteAction = (event, notificationId) => {
  event.stopPropagation();
  return async dispatch => {
    try {
      const response =
        await HeaderApiService.notificationApiServices.markNotificationAsReadAndDelete(
          notificationId
        );
      if (response?.data?.status === 'SUCCESS') {
        successNotification(response?.data?.message ?? 'Notification deleted successfully');
        dispatch({
          type: HEADER_NOTIFICATION_REDUX_CONSTANTS.TASK_DELETED_READ,
          id: notificationId,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const searchGlobalData = value => {
  return async dispatch => {
    try {
      const params = {
        searchString: value,
      };
      startGeneralLoaderOnRequest('gloabalSearchLoaderAction');
      const response = await HeaderApiService.globalSearchApiServices.getGlobalSearchData(params);
      if (response?.data?.status === 'SUCCESS') {
        stopGeneralLoaderOnSuccessOrFail('gloabalSearchLoaderAction');
        dispatch({
          type: HEADER_GLOBAL_SEARCH_REDUX_CONSTANTS.GET_SEARCH_RESULT_LIST,
          data: response?.data?.data,
        });
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('gloabalSearchLoaderAction');
      errorNotification(e);
    }
  };
};

export const turnOffNotifire = () => {
  return dispatch => {
    dispatch({
      type: HEADER_NOTIFICATION_REDUX_CONSTANTS.OFF_NOTIFIRE,
    });
  };
};

export const getNotificationAlertsDetail = id => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest('notificationAlertDetailsLoader');
      const response = await HeaderApiService.notificationApiServices.getNotificationAlertsDetails(
        id
      );
      if (response?.data?.status === 'SUCCESS') {
        stopGeneralLoaderOnSuccessOrFail('notificationAlertDetailsLoader');
        dispatch({
          type: HEADER_NOTIFICATION_REDUX_CONSTANTS.GET_NOTIFICATION_ALERTS_DETAILS,
          data: response?.data?.data,
        });
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('notificationAlertDetailsLoader');
      displayErrors(e);
    }
  };
};

export const clearNotificationAlertDetails = () => {
  return dispatch => {
    dispatch({
      type: HEADER_NOTIFICATION_REDUX_CONSTANTS.CLEAR_NOTIFICATION_ALERTS_DETAILS,
    });
  };
};

export const markAllNotificationAsRead = () => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest('markAllAsReadLoader');
      const response = await HeaderApiService.notificationApiServices.markAllAsRead();
      if (response?.data?.status === 'SUCCESS') {
        stopGeneralLoaderOnSuccessOrFail('markAllAsReadLoader');
        successNotification(response?.data?.message ?? 'Marked all notification as read.');
        dispatch({
          type: HEADER_NOTIFICATION_REDUX_CONSTANTS.MARKED_ALL_AS_READ,
        });
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('markAllAsReadLoader');
      displayErrors(e);
    }
  };
};

export const removeProfileDP = () => {
  return async dispatch => {
    try {
      const response = await HeaderApiService.removeProfilePicture();
      if (response?.data?.status === 'SUCCESS') {
        successNotification(response?.data?.message || 'Profile picture removed successfully.');
        dispatch(getLoggedUserDetails());
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};
