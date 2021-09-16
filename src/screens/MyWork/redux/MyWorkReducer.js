import moment from 'moment';
import { MY_WORK_REDUX_CONSTANTS } from './MyWorkReduxConstants';

const initialMyWork = {
  task: {
    taskList: {
      docs: [],
      total: 1,
      limit: 15,
      page: 1,
      pages: 1,
      headers: [],
    },
    addTask: {
      title: '',
      description: '',
      priority: [],
      entityType: [],
      entityId: [],
      assigneeId: [],
      dueDate: '',
      taskFrom: 'task',
    },
    taskDetail: {},
    myWorkDropDownData: {
      assigneeList: [],
      entityList: [],
    },
    taskColumnNameList: {},
    taskDefaultColumnNameList: {},
    filterDropDownData: {
      assigneeList: [],
    },
  },
  notification: {
    notificationList: [],
  },
};

export const myWorkReducer = (state = initialMyWork, action) => {
  switch (action.type) {
    case MY_WORK_REDUX_CONSTANTS.MY_WORK_TASK_REDUX_CONSTANTS.GET_TASK_LIST_SUCCESS_ACTION:
      return {
        ...state,
        task: {
          ...state?.task,
          taskList: {
            ...action?.data,
          },
        },
      };

    case MY_WORK_REDUX_CONSTANTS.MY_WORK_TASK_REDUX_CONSTANTS.MY_WORK_UPDATE_ADD_TASK_FIELD_ACTION:
      return {
        ...state,
        task: {
          ...state?.task,
          addTask: {
            ...state?.task?.addTask,
            [action?.name]: action?.value,
          },
        },
      };

    case MY_WORK_REDUX_CONSTANTS.MY_WORK_TASK_REDUX_CONSTANTS
      .MY_WORK_ASSIGNEE_DROP_DOWN_DATA_ACTION: {
      const assigneeList = action?.data?.map(data => ({
        label: data?.name,
        value: data?._id,
        name: 'assigneeId',
        type: data?.type,
      }));
      return {
        ...state,
        task: {
          ...state?.task,
          myWorkDropDownData: {
            ...state?.task?.myWorkDropDownData,
            assigneeList,
          },
        },
      };
    }

    case MY_WORK_REDUX_CONSTANTS.MY_WORK_TASK_REDUX_CONSTANTS
      .MY_WORK_ENTITY_DROP_DOWN_DATA_ACTION: {
      const entityList = action?.data?.map(data => ({
        label: data?.name ?? data?.applicationId ?? '',
        value: data?._id,
        name: 'entityId',
      }));

      return {
        ...state,
        task: {
          ...state?.task,
          myWorkDropDownData: {
            ...state?.task?.myWorkDropDownData,
            entityList,
          },
        },
      };
    }
    case MY_WORK_REDUX_CONSTANTS.MY_WORK_TASK_REDUX_CONSTANTS.RESET_MY_WORK_TASK_UPDATE_ENTITY_ID:
      return {
        ...state,
        task: {
          ...state?.task,
          taskDetail: {
            ...state?.task?.taskDetail,
            entityId: [],
          },
        },
      };

    case MY_WORK_REDUX_CONSTANTS.MY_WORK_TASK_REDUX_CONSTANTS.RESET_MY_WORK_ADD_TASK_ENTITY_ID:
      return {
        ...state,
        task: {
          ...state?.task,
          addTask: {
            ...state?.task?.addTask,
            entityId: [],
          },
        },
      };

    case MY_WORK_REDUX_CONSTANTS.MY_WORK_TASK_REDUX_CONSTANTS.RESET_ADD_TASK_STATE_ACTION:
      return {
        ...state,
        task: {
          ...state?.task,
          addTask: {
            title: '',
            description: '',
            priority: [],
            entityType: [],
            entityId: [],
            assigneeId: [],
            dueDate: '',
            taskFrom: 'task',
          },
          myWorkDropDownData: {
            assigneeList: [],
            entityList: [],
          },
        },
      };

    case MY_WORK_REDUX_CONSTANTS.MY_WORK_TASK_REDUX_CONSTANTS.RESET_MY_WORK_TASK_PAGINATION_DATA: {
      return {
        ...state,
        task: {
          ...state?.task,
          taskList: {
            ...state?.task?.taskList,
            page: action?.page,
            limit: action?.limit,
            pages: action?.pages,
            total: action?.total,
            docs: [],
          },
        },
      };
    }

    case MY_WORK_REDUX_CONSTANTS.MY_WORK_TASK_REDUX_CONSTANTS.RESET_MY_WORK_TASK_DATA: {
      return {
        ...state,
        task: {
          ...initialMyWork.task,
        },
      };
    }

    case MY_WORK_REDUX_CONSTANTS.MY_WORK_TASK_REDUX_CONSTANTS.TASK_COLUMN_NAME_LIST_ACTION:
      return {
        ...state,
        task: {
          ...state?.task,
          taskColumnNameList: action?.data,
        },
      };
    case MY_WORK_REDUX_CONSTANTS.MY_WORK_TASK_REDUX_CONSTANTS.TASK_DEFAULT_COLUMN_NAME_LIST_ACTION:
      return {
        ...state,
        task: {
          ...state?.task,
          taskDefaultColumnNameList: action?.data,
        },
      };

    case MY_WORK_REDUX_CONSTANTS.MY_WORK_TASK_REDUX_CONSTANTS.UPDATE_TASK_COLUMN_NAME_LIST_ACTION: {
      const taskColumnNameList = {
        ...state?.task?.taskColumnNameList,
      };
      const { type, name, value } = action?.data;
      taskColumnNameList[`${type}`] = taskColumnNameList[`${type}`]?.map(e =>
        e?.name === name ? { ...e, isChecked: value } : e
      );
      return {
        ...state,
        task: {
          ...state?.task,
          taskColumnNameList,
        },
      };
    }

    case MY_WORK_REDUX_CONSTANTS.MY_WORK_TASK_REDUX_CONSTANTS.ASSIGNEE_DROP_DOWN_DATA_FOR_FILTER: {
      const assigneeList = action?.data?.map(data => ({
        label: data?.name,
        value: data?._id,
        name: 'assigneeId',
        type: data?.type,
      }));
      return {
        ...state,
        task: {
          ...state?.task,
          filterDropDownData: {
            ...state?.task?.filterDropDownData,
            assigneeList,
          },
        },
      };
    }

    case MY_WORK_REDUX_CONSTANTS.MY_WORK_TASK_REDUX_CONSTANTS.GET_TASK_DETAIL_BY_ID_ACTION:
      return {
        ...state,
        task: {
          ...state?.task,
          taskDetail: {
            defaultEntityId: action?.data?.entityId,
            ...action?.data,
          },
        },
      };

    case MY_WORK_REDUX_CONSTANTS.MY_WORK_TASK_REDUX_CONSTANTS.UPDATE_EDIT_TASK_FIELD_ACTION:
      return {
        ...state,
        task: {
          ...state?.task,
          taskDetail: {
            ...state?.task?.taskDetail,
            [action?.name]: action?.value,
          },
        },
      };

    case MY_WORK_REDUX_CONSTANTS.MY_WORK_TASK_REDUX_CONSTANTS.RESET_EDIT_TASK_STATE_ACTION:
      return {
        ...state,
        task: {
          ...state?.task,
          taskDetail: {},
          myWorkDropDownData: {
            assigneeList: [],
            entityList: [],
          },
        },
      };

    case MY_WORK_REDUX_CONSTANTS.MY_WORK_NOTIFICATION_REDUX_CONSTANTS
      .GET_MY_WORK_NOTIFICATION_LIST_REQUEST_ACTION:
      return {
        ...state,
        notification: {
          ...state?.notification,
        },
      };
    case MY_WORK_REDUX_CONSTANTS.MY_WORK_NOTIFICATION_REDUX_CONSTANTS
      .GET_MY_WORK_NOTIFICATION_LIST_SUCCESS_ACTION: {
      let notificationList = state?.notification?.notificationList ?? [];
      let hasMoreData = false;
      const { page, pages, docs } = action?.data;
      notificationList = notificationList?.map(elem => {
        if (docs[elem?.title]) {
          const final = docs[elem?.title];
          delete docs[elem?.title];
          return { ...elem, data: [...elem?.data, ...final] };
        }
        return elem;
      });
      if (page < pages) {
        hasMoreData = true;
      }
      const newNotificationList = Object.entries(docs).map(([key, value]) => ({
        title: key,
        data: value,
      }));

      return {
        ...state,
        notification: {
          ...state?.notification,
          notificationList: [...new Set([...newNotificationList, ...notificationList])],
          page: action?.data?.page,
          limit: action?.data?.limit,
          pages: action?.data?.pages,
          total: action?.data?.total,
          hasMoreData,
        },
      };
    }
    case MY_WORK_REDUX_CONSTANTS.MY_WORK_NOTIFICATION_REDUX_CONSTANTS
      .GET_MY_WORK_NOTIFICATION_LIST_FAIL_ACTION:
      return {
        ...state,
        notification: {
          ...state.notification,
        },
      };
    case MY_WORK_REDUX_CONSTANTS.MY_WORK_NOTIFICATION_REDUX_CONSTANTS
      .DELETE_MY_WORK_NOTIFICATION_ACTION: {
      const notifications = state?.notification?.notificationList ?? [];
      const finalData = [];

      notifications?.forEach(notification => {
        const data = notification?.data?.filter(e => e?._id !== action.data);

        if (data.length > 0) {
          finalData.push({ ...notification, data });
        }
      });

      return {
        ...state,
        notification: {
          ...state.notification,
          notificationList: finalData,
        },
      };
    }

    case MY_WORK_REDUX_CONSTANTS.MY_WORK_NOTIFICATION_REDUX_CONSTANTS.CLEAR_NOTIFICATION_DATA:
      return {
        ...state,
        notification: {
          notificationList: [],
        },
      };

    case MY_WORK_REDUX_CONSTANTS.MY_WORK_NOTIFICATION_REDUX_CONSTANTS
      .GET_NOTIFICATION_FROM_SOCKET: {
      let notificationList = state?.notification?.notificationList ?? [];
      const { updatedAt, _id, description } = action?.data;
      const data = {
        [moment(updatedAt).format('YYYY-M-DD')]: [{ updatedAt, _id, description }],
      };
      notificationList = notificationList?.map(elem => {
        if (data[elem.title]) {
          const final = data[elem.title];
          delete data[elem.title];
          return { ...elem, data: [...final, ...elem.data] };
        }
        return elem;
      });
      const newNotificationList = Object.entries(data).map(([key, value]) => ({
        title: key,
        data: value,
      }));

      return {
        ...state,
        notification: {
          ...state?.notification,
          notificationList: [...new Set([...newNotificationList, ...notificationList])],
        },
      };
    }

    default:
      return state;
  }
};
