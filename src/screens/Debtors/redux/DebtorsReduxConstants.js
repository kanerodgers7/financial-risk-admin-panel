export const DEBTORS_REDUX_CONSTANTS = {
  FETCH_DEBTOR_LIST_REQUEST: 'FETCH_DEBTOR_LIST_REQUEST',
  FETCH_DEBTOR_LIST_SUCCESS: 'FETCH_DEBTOR_LIST_SUCCESS',
  FETCH_DEBTOR_LIST_FAILURE: 'FETCH_DEBTOR_LIST_FAILURE',
  SELECTED_DEBTORS_DATA: 'SELECTED_DEBTORS_DATA',
  DEBTOR_LIST_RESET_PAGINATION_DATA: 'DEBTOR_LIST_RESET_PAGINATION_DATA',
  RESET_DEBTOR_LIST_DATA: 'RESET_DEBTOR_LIST_DATA',

  VIEW_DEBTOR_ACTIVE_TAB_INDEX: 'VIEW_DEBTOR_ACTIVE_TAB_INDEX',
  RESET_DEBTOR_VIEW_DATA: 'RESET_DEBTOR_VIEW_DATA',

  NOTES: {
    FETCH_DEBTOR_NOTES_LIST_SUCCESS: 'FETCH_DEBTOR_NOTES_LIST_SUCCESS',
    FETCH_DEBTOR_NOTES_LIST_FAILURE: 'FETCH_DEBTOR_NOTES_LIST_FAILURE',
    DEBTORS_NOTES_LIST_USER_ACTION: 'DEBTORS_NOTES_LIST_USER_ACTION',
  },
  DOCUMENTS: {
    FETCH_DEBTOR_DOCUMENTS_LIST_SUCCESS: 'FETCH_DEBTOR_DOCUMENTS_LIST_SUCCESS',
    FETCH_DEBTOR_DOCUMENTS_LIST_FAILURE: 'FETCH_DEBTOR_DOCUMENTS_LIST_FAILURE',
    DEBTOR_DOCUMENTS_LIST_USER_ACTION: 'DEBTOR_DOCUMENTS_LIST_USER_ACTION',
    DEBTOR_DOCUMENTS_MANAGEMENT_COLUMN_LIST_ACTION:
      'DEBTOR_DOCUMENTS_MANAGEMENT_COLUMN_LIST_ACTION',
    DEBTOR_DOCUMENTS_MANAGEMENT_DEFAULT_COLUMN_LIST_ACTION:
      'DEBTOR_DOCUMENTS_MANAGEMENT_DEFAULT_COLUMN_LIST_ACTION',
    UPDATE_DEBTOR_DOCUMENTS_COLUMN_LIST_ACTION: 'UPDATE_DEBTOR_DOCUMENTS_COLUMN_LIST_ACTION',
    DEBTOR_DOCUMENT_TYPE_LIST_USER_ACTION: 'DEBTOR_DOCUMENT_TYPE_LIST_USER_ACTION',
    UPLOAD_DOCUMENT_DEBTOR_ACTION: 'UPLOAD_DOCUMENT_DEBTOR_ACTION',
  },
  TASK: {
    FETCH_DEBTOR_TASK_LIST_SUCCESS: 'FETCH_DEBTOR_TASK_LIST_SUCCESS',
    FETCH_DEBTOR_TASK_LIST_FAILURE: 'FETCH_DEBTOR_TASK_LIST_FAILURE',
    DEBTOR_TASK_LIST_ACTION: 'DEBTOR_TASK_LIST_ACTION',
    DEBTOR_TASK_COLUMN_NAME_LIST_ACTION: 'DEBTOR_TASK_COLUMN_NAME_LIST_ACTION',
    DEBTOR_TASK_DEFAULT_COLUMN_NAME_LIST_ACTION: 'DEBTOR_TASK_DEFAULT_COLUMN_NAME_LIST_ACTION',
    UPDATE_DEBTOR_TASK_COLUMN_NAME_LIST_ACTION: 'UPDATE_DEBTOR_TASK_COLUMN_NAME_LIST_ACTION',
    ADD_TASK: {
      DEBTOR_UPDATE_ADD_TASK_FIELD_ACTION: 'DEBTOR_UPDATE_ADD_TASK_FIELD_ACTION',
      DEBTOR_ASSIGNEE_DROP_DOWN_DATA_ACTION: 'DEBTOR_ASSIGNEE_DROP_DOWN_DATA_ACTION',
      DEBTOR_ENTITY_DROP_DOWN_DATA_ACTION: 'DEBTOR_ENTITY_DROP_DOWN_DATA_ACTION',
      DEBTOR_DEFAULT_DEBTOR_ENTITY_DROP_DOWN_DATA_ACTION:
        'DEBTOR_DEFAULT_DEBTOR_ENTITY_DROP_DOWN_DATA_ACTION',
      DEBTOR_RESET_ADD_TASK_STATE_ACTION: 'DEBTOR_RESET_ADD_TASK_STATE_ACTION',
    },
    EDIT_TASK: {
      GET_DEBTOR_TASK_DETAILS_ACTION: 'GET_DEBTOR_TASK_DETAILS_ACTION',
    },
  },
  APPLICATION: {
    FETCH_DEBTOR_APPLICATION_LIST_SUCCESS: 'FETCH_DEBTOR_APPLICATION_LIST_SUCCESS',
    FETCH_DEBTOR_APPLICATION_LIST_FAILURE: 'FETCH_DEBTOR_APPLICATION_LIST_FAILURE',
    DEBTOR_APPLICATION_COLUMN_LIST_ACTION: 'DEBTOR_APPLICATION_COLUMN_LIST_ACTION',
    DEBTOR_APPLICATION_DEFAULT_COLUMN_LIST_ACTION: 'DEBTOR_APPLICATION_DEFAULT_COLUMN_LIST_ACTION',
    UPDATE_DEBTOR_APPLICATION_COLUMN_LIST_ACTION: 'UPDATE_DEBTOR_APPLICATION_COLUMN_LIST_ACTION',
  },

  CREDIT_LIMIT: {
    FETCH_DEBTOR_CREDIT_LIMIT_LIST_SUCCESS: 'FETCH_DEBTOR_CREDIT_LIMIT_LIST_SUCCESS',
    FETCH_DEBTOR_CREDIT_LIMIT_LIST_FAILURE: 'FETCH_DEBTOR_CREDIT_LIMIT_LIST_FAILURE',
    DEBTOR_CREDIT_LIMIT_LIST_ACTION: 'DEBTOR_CREDIT_LIMIT_LIST_ACTION',
    DEBTOR_CREDIT_LIMIT_COLUMN_LIST_ACTION: 'DEBTOR_CREDIT_LIMIT_COLUMN_LIST_ACTION',
    DEBTOR_CREDIT_LIMIT_DEFAULT_COLUMN_LIST_ACTION:
      'DEBTOR_CREDIT_LIMIT_DEFAULT_COLUMN_LIST_ACTION',
    UPDATE_DEBTOR_CREDIT_LIMIT_COLUMN_LIST_ACTION: 'UPDATE_DEBTOR_CREDIT_LIMIT_COLUMN_LIST_ACTION',
  },

  STAKE_HOLDER: {
    FETCH_DEBTOR_STAKE_HOLDER_LIST_SUCCESS: 'FETCH_DEBTOR_STAKE_HOLDER_LIST_SUCCESS',
    FETCH_DEBTOR_STAKE_HOLDER_LIST_FAILURE: 'FETCH_DEBTOR_STAKE_HOLDER_LIST_FAILURE',
    DEBTOR_STAKE_HOLDER_LIST_ACTION: 'DEBTOR_STAKE_HOLDER_LIST_ACTION',
    DEBTOR_STAKE_HOLDER_COLUMN_LIST_ACTION: 'DEBTOR_STAKE_HOLDER_COLUMN_LIST_ACTION',
    DEBTOR_STAKE_HOLDER_DEFAULT_COLUMN_LIST_ACTION:
      'DEBTOR_STAKE_HOLDER_DEFAULT_COLUMN_LIST_ACTION',
    UPDATE_DEBTOR_STAKE_HOLDER_COLUMN_LIST_ACTION: 'UPDATE_DEBTOR_STAKE_HOLDER_COLUMN_LIST_ACTION',
    STAKE_HOLDER_CRUD: {
      GET_STAKE_HOLDER_DETAILS: 'GET_STAKE_HOLDER_DETAILS',
      CHANGE_DEBTOR_STAKE_HOLDER_PERSON_TYPE: 'CHANGE_DEBTOR_STAKE_HOLDER_PERSON_TYPE',
      UPDATE_STAKE_HOLDER_FIELDS: 'UPDATE_STAKE_HOLDER_FIELDS',
      UPDATE_STAKE_HOLDER_COMPANY_ALL_DATA: 'UPDATE_STAKE_HOLDER_COMPANY_ALL_DATA',
      GET_STAKEHOLDER_DROPDOWN_DATA: 'GET_STAKEHOLDER_DROPDOWN_DATA',
      STAKE_HOLDER_ENTITY_TYPE_DATA: 'STAKE_HOLDER_ENTITY_TYPE_DATA',
      WIPE_OUT_ENTITY_TABLE_DATA: 'WIPE_OUT_ENTITY_TABLE_DATA',
      RESET_STAKE_HOLDER_STATE: 'RESET_STAKE_HOLDER_STATE',
    },
  },
  REPORTS: {
    FETCH_DEBTOR_REPORTS_LIST_SUCCESS: 'FETCH_DEBTOR_REPORTS_LIST_SUCCESS',
    FETCH_DEBTOR_REPORTS_LIST_FAILURE: 'FETCH_DEBTOR_REPORTS_LIST_FAILURE',
    DEBTOR_REPORTS_COLUMN_LIST_ACTION: 'DEBTOR_REPORTS_COLUMN_LIST_ACTION',
    DEBTOR_REPORTS_DEFAULT_COLUMN_LIST_ACTION: 'DEBTOR_REPORTS_DEFAULT_COLUMN_LIST_ACTION',
    UPDATE_DEBTOR_REPORTS_COLUMN_LIST_ACTION: 'UPDATE_DEBTOR_REPORTS_COLUMN_LIST_ACTION',
    FETCH_DEBTOR_REPORTS_LIST_DATA_FOR_FETCH: 'FETCH_DEBTOR_REPORTS_LIST_DATA_FOR_FETCH',
  },
  DEBTOR_OVERDUE: {
    GET_DEBTOR_OVERDUE_LIST: 'GET_DEBTOR_OVERDUE_LIST',
    GET_DEBTOR_OVERDUE_ENTITY_LIST: 'GET_DEBTOR_OVERDUE_ENTITY_LIST',
    RESET_DEBTOR_OVERDUE_LIST_DATA: 'RESET_DEBTOR_OVERDUE_LIST_DATA',
  },
  DEBTOR_CLAIMS: {
    DEBTOR_CLAIMS_LIST_SUCCESS: 'DEBTOR_CLAIMS_LIST_SUCCESS',
    RESET_DEBTOR_CLAIM_LIST_DATA: 'RESET_DEBTOR_CLAIM_LIST_DATA',

    GET_DEBTOR_CLAIMS_COLUMNS_LIST: 'GET_DEBTOR_CLAIMS_COLUMNS_LIST',
    GET_DEBTOR_CLAIMS_DEFAULT_COLUMN_LIST: 'GET_DEBTOR_CLAIMS_DEFAULT_COLUMN_LIST',
    UPDATE_DEBTOR_CLAIMS_COLUMNS_LIST: 'UPDATE_DEBTOR_CLAIMS_COLUMNS_LIST',
  },
};
export const DEBTORS_MANAGEMENT_COLUMN_LIST_REDUX_CONSTANTS = {
  DEBTORS_MANAGEMENT_COLUMN_LIST_ACTION: 'DEBTORS_MANAGEMENT_COLUMN_LIST_ACTION',
  DEBTORS_MANAGEMENT_DEFAULT_COLUMN_LIST_ACTION: 'DEBTORS_MANAGEMENT_DEFAULT_COLUMN_LIST_ACTION',
  UPDATE_DEBTORS_MANAGEMENT_COLUMN_LIST_ACTION: 'UPDATE_DEBTORS_MANAGEMENT_COLUMN_LIST_ACTION',
};
export const DEBTOR_MANAGEMENT_CRUD_REDUX_CONSTANTS = {
  DEBTOR_MANAGEMENT_UPDATE_DEBTOR_ACTION: 'DEBTOR_MANAGEMENT_UPDATE_DEBTOR_ACTION',
  DEBTOR_MANAGEMENT_UPDATE_DEBTOR_ADDRESS_ACTION: 'DEBTOR_MANAGEMENT_UPDATE_DEBTOR_ADDRESS_ACTION',
  DEBTORS_MANAGEMENT_DROPDOWN_LIST_REDUX_CONSTANTS:
    'DEBTORS_MANAGEMENT_DROPDOWN_LIST_REDUX_CONSTANTS',
};
