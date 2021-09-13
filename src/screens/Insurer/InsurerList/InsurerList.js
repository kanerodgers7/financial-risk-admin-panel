import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import _ from 'lodash';
import IconButton from '../../../common/IconButton/IconButton';
import Table from '../../../common/Table/Table';
import Pagination from '../../../common/Pagination/Pagination';
import {
  changeInsurerColumnListStatus,
  getInsurerColumnNameList,
  getInsurerListByFilter,
  getListFromCrm,
  resetInsurerListPaginationData,
  saveInsurerColumnListName,
} from '../redux/InsurerAction';
import CustomFieldModal from '../../../common/Modal/CustomFieldModal/CustomFieldModal';
import Loader from '../../../common/Loader/Loader';
import Button from '../../../common/Button/Button';
import Modal from '../../../common/Modal/Modal';
import BigInput from '../../../common/BigInput/BigInput';
import Checkbox from '../../../common/Checkbox/Checkbox';
import { errorNotification, successNotification } from '../../../common/Toast';
import {
  INSURER_COLUMN_LIST_REDUX_CONSTANTS,
  INSURER_CRM_REDUX_CONSTANTS,
} from '../redux/InsurerReduxConstants';
import InsurerApiService from '../services/InsurerApiService';
import { useQueryParams } from '../../../hooks/GetQueryParamHook';
import {
  startGeneralLoaderOnRequest,
  stopGeneralLoaderOnSuccessOrFail,
} from '../../../common/GeneralLoader/redux/GeneralLoaderAction';
import { useModulePrivileges } from '../../../hooks/userPrivileges/useModulePrivilegesHook';
import { SIDEBAR_NAMES } from '../../../constants/SidebarConstants';

const InsurerList = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const searchInputRef = useRef();
  const insurerListWithPageData = useSelector(({ insurer }) => insurer?.insurerList ?? {});
  const { insurerColumnNameList, insurerDefaultColumnNameList } = useSelector(
    ({ insurer }) => insurer ?? {}
  );
  const isInsurerUpdatable = useModulePrivileges(SIDEBAR_NAMES.INSURER).hasWriteAccess;
  const {
    insurerListColumnSaveButtonLoaderAction,
    insurerListColumnResetButtonLoaderAction,
    insurerListAddFromCRMButtonLoaderAction,
    insurerListLoader,
  } = useSelector(({ generalLoaderReducer }) => generalLoaderReducer ?? false);

  const { total, pages, page, limit, docs, headers } = useMemo(
    () => insurerListWithPageData ?? {},
    [insurerListWithPageData]
  );

  const { page: paramPage, limit: paramLimit } = useQueryParams();

  const getInsurerList = useCallback(
    (params = {}, cb) => {
      const data = {
        page: page ?? 1,
        limit: limit ?? 15,
        ...params,
      };
      dispatch(getInsurerListByFilter(data));
      if (cb && typeof cb === 'function') {
        cb();
      }
    },
    [page, limit]
  );

  const onSelectLimit = useCallback(
    newLimit => {
      getInsurerList({ page: 1, limit: newLimit });
    },
    [getInsurerList]
  );

  const pageActionClick = useCallback(
    newPage => {
      getInsurerList({ page: newPage, limit });
    },
    [limit, getInsurerList]
  );

  const [customFieldModal, setCustomFieldModal] = useState(false);
  const toggleCustomField = useCallback(
    value => setCustomFieldModal(value !== undefined ? value : e => !e),
    [setCustomFieldModal]
  );

  const onClickSaveColumnSelection = useCallback(async () => {
    try {
      const isBothEqual = _.isEqual(insurerColumnNameList, insurerDefaultColumnNameList);
      if (!isBothEqual) {
        await dispatch(saveInsurerColumnListName({ insurerColumnNameList }));
        getInsurerList();
      } else {
        errorNotification('Please select different columns to apply changes.');
        throw Error();
      }
      toggleCustomField();
    } catch (e) {
      /**/
    }
  }, [toggleCustomField, insurerColumnNameList, getInsurerList, insurerDefaultColumnNameList]);

  const onClickResetDefaultColumnSelection = useCallback(async () => {
    await dispatch(saveInsurerColumnListName({ isReset: true }));
    dispatch(getInsurerColumnNameList());
    getInsurerList();
    toggleCustomField();
  }, [toggleCustomField, getInsurerList]);

  const onClickCloseColumnSelection = useCallback(() => {
    dispatch({
      type: INSURER_COLUMN_LIST_REDUX_CONSTANTS.INSURER_COLUMN_LIST_ACTION,
      data: insurerDefaultColumnNameList,
    });
    toggleCustomField();
  }, [insurerDefaultColumnNameList, toggleCustomField]);

  const customFieldsModalButtons = useMemo(
    () => [
      {
        title: 'Reset Defaults',
        buttonType: 'outlined-primary',
        onClick: onClickResetDefaultColumnSelection,
        isLoading: insurerListColumnResetButtonLoaderAction,
      },
      { title: 'Close', buttonType: 'primary-1', onClick: onClickCloseColumnSelection },
      {
        title: 'Save',
        buttonType: 'primary',
        onClick: onClickSaveColumnSelection,
        isLoading: insurerListColumnSaveButtonLoaderAction,
      },
    ],
    [
      onClickResetDefaultColumnSelection,
      onClickCloseColumnSelection,
      onClickSaveColumnSelection,
      insurerListColumnSaveButtonLoaderAction,
      insurerListColumnResetButtonLoaderAction,
    ]
  );
  const { defaultFields, customFields } = useMemo(
    () => insurerColumnNameList ?? { defaultFields: [], customFields: [] },
    [insurerColumnNameList]
  );

  const onChangeSelectedColumn = useCallback((type, name, value) => {
    const data = { type, name, value };
    dispatch(changeInsurerColumnListStatus(data));
  }, []);

  const onSelectInsurerRecord = useCallback(
    id => {
      history.push(`/insurer/view/${id}`);
    },
    [history]
  );

  useEffect(() => {
    const params = {
      page: page ?? 1,
      limit: limit ?? 15,
    };
    const url = Object.entries(params)
      .filter(arr => arr[1] !== undefined)
      .map(([k, v]) => `${k}=${v}`)
      .join('&');

    history.replace(`${history?.location?.pathname}?${url}`);
  }, [total, pages, page, limit]);

  useEffect(() => {
    const params = {
      page: paramPage ?? page ?? 1,
      limit: paramLimit ?? limit ?? 15,
    };

    getInsurerList({ ...params });
    dispatch(getInsurerColumnNameList());
    dispatch(resetInsurerListPaginationData(page, pages, total, limit));
  }, []);

  /** *
   * CRM Feature
   * * */

  const syncListFromCrm = useSelector(({ insurer }) => insurer?.syncInsurerWithCRM);
  const [addFromCRM, setAddFromCRM] = useState(false);
  const [crmIds, setCrmIds] = useState([]);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const onClickAddFromCRM = useCallback(
    value => setAddFromCRM(value !== undefined ? value : e => !e),
    [addFromCRM]
  );

  const toggleAddFromCRM = useCallback(() => {
    setCrmIds([]);
    dispatch({
      type: INSURER_CRM_REDUX_CONSTANTS.INSURER_GET_LIST_FROM_CRM_ACTION,
      data: [],
    });
    setAddFromCRM(e => !e);
  }, [setAddFromCRM, setCrmIds]);

  const addDataFromCrm = useCallback(() => {
    const data = {
      crmIds,
    };
    try {
      if (data?.crmIds?.length > 0) {
        startGeneralLoaderOnRequest('insurerListAddFromCRMButtonLoaderAction');
        InsurerApiService.addInsurerListFromCrm(data)
          .then(res => {
            if (res?.data?.status === 'SUCCESS') {
              successNotification(res?.data?.message ?? 'Insurer data synced successfully');
              getInsurerList();
              stopGeneralLoaderOnSuccessOrFail('insurerListAddFromCRMButtonLoaderAction');
              toggleAddFromCRM();
            }
          })
          .catch(e => {
            errorNotification(e?.data?.message ?? 'Internal server error');
            stopGeneralLoaderOnSuccessOrFail('insurerListAddFromCRMButtonLoaderAction');
          });
      } else {
        errorNotification('Please select at least one insurer to Add');
      }
    } catch (e) {
      /**/
    }
  }, [crmIds, toggleAddFromCRM, getInsurerList]);

  const addToCRMButtons = useMemo(
    () => [
      { title: 'Close', buttonType: 'primary-1', onClick: toggleAddFromCRM },
      {
        title: 'Add',
        buttonType: 'primary',
        onClick: addDataFromCrm,
        isLoading: insurerListAddFromCRMButtonLoaderAction,
      },
    ],
    [toggleAddFromCRM, addDataFromCrm, insurerListAddFromCRMButtonLoaderAction]
  );

  const checkIfEnterKeyPressed = useCallback(async () => {
    try {
      const searchKeyword = searchInputRef?.current?.value;
      if (searchKeyword?.trim()?.toString()?.length > 0) {
        setIsModalLoading(true);
        await dispatch(getListFromCrm(searchKeyword?.trim()?.toString()));
        setIsModalLoading(false);
      }
    } catch (e) {
      /**/
    }
  }, [setIsModalLoading]);

  const selectInsurerFromCrm = useCallback(
    crmId => {
      let arr = [...crmIds];
      if (arr?.includes(crmId)) {
        arr = arr?.filter(e => e !== crmId);
      } else {
        arr = [...arr, crmId];
      }
      setCrmIds(arr);
    },
    [crmIds, setCrmIds]
  );

  return (
    <>
      {!insurerListLoader ? (
        <>
          <div className="page-header">
            <div className="page-header-name">Insurer List</div>
            <div className="page-header-button-container">
              <IconButton
                buttonType="primary"
                title="format_line_spacing"
                className="mr-10"
                buttonTitle="Click to select custom fields"
                onClick={() => toggleCustomField()}
              />
              {isInsurerUpdatable && (
                <Button title="Add From CRM" buttonType="success" onClick={onClickAddFromCRM} />
              )}
            </div>
          </div>
          {docs?.length > 0 ? (
            <>
              <div className="common-list-container">
                <Table
                  align="left"
                  valign="center"
                  tableClass="main-list-table"
                  data={docs}
                  headers={headers}
                  recordSelected={onSelectInsurerRecord}
                  recordActionClick={() => {}}
                  rowClass="cursor-pointer"
                />
              </div>
              <Pagination
                className="common-list-pagination"
                total={total}
                pages={pages}
                page={page}
                limit={limit}
                pageActionClick={pageActionClick}
                onSelectLimit={onSelectLimit}
              />
            </>
          ) : (
            <div className="no-record-found">No record found</div>
          )}
          {customFieldModal && (
            <CustomFieldModal
              defaultFields={defaultFields}
              customFields={customFields}
              onChangeSelectedColumn={onChangeSelectedColumn}
              buttons={customFieldsModalButtons}
            />
          )}
          {addFromCRM && (
            <Modal
              header="Add From CRM"
              className="add-to-crm-modal"
              buttons={addToCRMButtons}
              hideModal={toggleAddFromCRM}
            >
              <BigInput
                ref={searchInputRef}
                prefix="search"
                prefixClass="font-placeholder"
                placeholder="Search Insurer"
                type="text"
                onKeyDown={_.debounce(checkIfEnterKeyPressed, 1000)}
              />
              {!isModalLoading ? (
                <>
                  {/* <Checkbox title="Name" className="check-all-crmList" /> */}
                  <div className="crm-checkbox-list-container">
                    {syncListFromCrm && syncListFromCrm?.length > 0 ? (
                      syncListFromCrm?.map(crm => (
                        <Checkbox
                          title={crm?.name}
                          className="crm-checkbox-list"
                          checked={crmIds?.includes(crm?.crmId?.toString())}
                          onChange={() => selectInsurerFromCrm(crm?.crmId?.toString())}
                        />
                      ))
                    ) : (
                      <div className="no-record-found">No record found</div>
                    )}
                  </div>
                </>
              ) : (
                <Loader />
              )}
            </Modal>
          )}
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};
export default InsurerList;
