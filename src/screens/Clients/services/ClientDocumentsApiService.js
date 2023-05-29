import ApiService from '../../../services/api-service/ApiService';
import { CLIENT_URLS } from '../../../constants/UrlConstants';

const ClientDocumentsApiService = {
  getClientDocumentsList: (id, params) =>
    ApiService.getData(`${CLIENT_URLS.DOCUMENTS.DOCUMENTS_LIST}${id}`, { params }),
  getClientDocumentsColumnNamesList: params =>
    ApiService.getData(`${CLIENT_URLS.DOCUMENTS.COLUMN_NAME_LIST_URL}`, { params }),
  updateClientDocumentColumnListName: data =>
    ApiService.putData(`${CLIENT_URLS.DOCUMENTS.COLUMN_NAME_LIST_URL}`, data),
  getDocumentTypeList: params =>
    ApiService.getData(`${CLIENT_URLS.DOCUMENTS.GET_DOCUMENT_TYPE_URL}`, { params }),
  uploadDocument: (data, config) =>
    ApiService.postData(CLIENT_URLS.DOCUMENTS.UPLOAD_DOCUMENT_URL, data, {
      ...config,
      timeout: 60000,
    }),
  downloadDocuments: params =>
    ApiService.request({
      url: `${CLIENT_URLS.DOCUMENTS.DOWNLOAD_DOCUMENTS_URL}`,
      params,
      method: 'GET',
      responseType: 'blob',
      timeout: 60000,
    }),
  deleteClientDocument: id => ApiService.deleteData(`${CLIENT_URLS.DOCUMENTS.DOCUMENTS_LIST}${id}`),
};
export default ClientDocumentsApiService;
