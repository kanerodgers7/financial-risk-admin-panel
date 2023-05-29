import ApiService from '../../../services/api-service/ApiService';
import { CLIENT_URLS } from '../../../constants/UrlConstants';

const ClientCreditLimitApiService = {
  getClientCreditLimitList: (id, params) =>
    ApiService.getData(`${CLIENT_URLS.CREDIT_LIMIT.CREDIT_LIMIT_LIST}${id}`, { params }),
  getClientCreditLimitColumnNameList: () =>
    ApiService.getData(CLIENT_URLS.CREDIT_LIMIT.COLUMN_NAME_LIST_URL),
  updateClientCreditLimitColumnNameList: data =>
    ApiService.putData(`${CLIENT_URLS.CREDIT_LIMIT.UPDATE_COLUMN_NAME_LIST_URL}`, data),
  modifyClientCreditLimitData: (id, data) =>
    ApiService.putData(`${CLIENT_URLS.CREDIT_LIMIT.CREDIT_LIMIT_ACTIONS}${id}`, data),
  surrenderClientCreditLimitData: (id, data) =>
    ApiService.putData(`${CLIENT_URLS.CREDIT_LIMIT.CREDIT_LIMIT_ACTIONS}${id}`, data),
  downloadCreditLimitCSVFile: id =>
    ApiService.request({
      url: `${CLIENT_URLS.CREDIT_LIMIT.DOWNLOAD_CLIENT_CREDIT_LIMIT_CSV}${id}`,
      method: 'GET',
      responseType: 'blob',
      timeout: 60000,
    }),
  downloadCreditLimitDecisionLetter: id =>
    ApiService.request({
      url: `${CLIENT_URLS.CREDIT_LIMIT.DOWNLOAD_CLIENT_CREDIT_LIMIT_DECISION_LETTER}${id}`,
      method: 'GET',
      responseType: 'blob',
      timeout: 60000,
    }),
};
export default ClientCreditLimitApiService;
