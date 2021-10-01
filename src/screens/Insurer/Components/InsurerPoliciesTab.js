import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import _ from 'lodash';
import {
  changeInsurerPoliciesColumnListStatus,
  getInsurerPoliciesColumnNameList,
  getInsurerPoliciesListData,
  getPolicySyncListForCRM,
  saveInsurerPoliciesColumnNameList,
} from '../redux/InsurerAction';
import BigInput from '../../../common/BigInput/BigInput';
import IconButton from '../../../common/IconButton/IconButton';
import Button from '../../../common/Button/Button';
import Table from '../../../common/Table/Table';
import Pagination from '../../../common/Pagination/Pagination';
import Loader from '../../../common/Loader/Loader';
import CustomFieldModal from '../../../common/Modal/CustomFieldModal/CustomFieldModal';
import { errorNotification, successNotification } from '../../../common/Toast';
import Modal from '../../../common/Modal/Modal';
import Checkbox from '../../../common/Checkbox/Checkbox';
import { INSURER_VIEW_REDUX_CONSTANT } from '../redux/InsurerReduxConstants';
import InsurerPoliciesApiServices from '../services/InsurerPoliciesApiServices';
import {
  startGeneralLoaderOnRequest,
  stopGeneralLoaderOnSuccessOrFail,
} from '../../../common/GeneralLoader/redux/GeneralLoaderAction';
import { SIDEBAR_NAMES } from '../../../constants/SidebarConstants';
import UserPrivilegeWrapper from '../../../common/UserPrivilegeWrapper/UserPrivilegeWrapper';

const InsurerPoliciesTab = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const searchInputRef = useRef();

  const [customFieldModal, setCustomFieldModal] = useState(false);
  const toggleCustomField = useCallback(
    value => setCustomFieldModal(value !== undefined ? value : e => !e),
    [setCustomFieldModal]
  );
  const { policiesList, insurerPoliciesColumnNameList, insurerPoliciesDefaultColumnNameList } =
    useSelector(({ insurer }) => insurer?.policies ?? {});

  const {
    viewInsurerPoliciesColumnResetButtonLoaderAction,
    viewInsurerPoliciesColumnSaveButtonLoaderAction,
    viewInsurerPoliciesSyncWithCRMButtonLoaderAction,
  } = useSelector(({ generalLoaderReducer }) => generalLoaderReducer ?? false);

  const { total, pages, page, limit, docs, headers } = useMemo(
    () => policiesList ?? {},
    [policiesList]
  );

  const syncListFromCrm = useSelector(({ insurer }) => insurer?.policies?.policySyncList ?? []);
  const getInsurerPoliciesList = useCallback(
    (params = {}, cb) => {
      const data = {
        page: page ?? 1,
        limit: limit ?? 15,
        ...params,
      };
      dispatch(getInsurerPoliciesListData(id, data));
      if (cb && typeof cb === 'function') {
        cb();
      }
    },
    [page, limit, id]
  );

  const { defaultFields, customFields } = useMemo(
    () => insurerPoliciesColumnNameList ?? { defaultFields: [], customFields: [] },
    [insurerPoliciesColumnNameList]
  );

  const onClickSaveColumnSelection = useCallback(async () => {
    try {
      const isBothEqual = _.isEqual(
        insurerPoliciesColumnNameList,
        insurerPoliciesDefaultColumnNameList
      );
      if (!isBothEqual) {
        await dispatch(saveInsurerPoliciesColumnNameList({ insurerPoliciesColumnNameList }));
        getInsurerPoliciesList();
      } else {
        errorNotification('Please select different columns to apply changes.');
        throw Error();
      }
      toggleCustomField();
    } catch (e) {
      /**/
    }
  }, [
    toggleCustomField,
    insurerPoliciesColumnNameList,
    getInsurerPoliciesList,
    insurerPoliciesDefaultColumnNameList,
  ]);

  const onClickResetDefaultColumnSelection = useCallback(async () => {
    await dispatch(saveInsurerPoliciesColumnNameList({ isReset: true }));
    dispatch(getInsurerPoliciesColumnNameList());
    getInsurerPoliciesList();
    toggleCustomField();
  }, [toggleCustomField, getInsurerPoliciesList]);

  const onClickCloseColumnSelection = useCallback(() => {
    dispatch({
      type: INSURER_VIEW_REDUX_CONSTANT.POLICIES.INSURER_POLICIES_COLUMN_LIST_ACTION,
      data: insurerPoliciesDefaultColumnNameList,
    });
    toggleCustomField();
  }, [insurerPoliciesDefaultColumnNameList, toggleCustomField]);

  const customFieldsModalButtons = useMemo(
    () => [
      {
        title: 'Reset Defaults',
        buttonType: 'outlined-primary',
        onClick: onClickResetDefaultColumnSelection,
        isLoading: viewInsurerPoliciesColumnResetButtonLoaderAction,
      },
      { title: 'Close', buttonType: 'primary-1', onClick: onClickCloseColumnSelection },
      {
        title: 'Save',
        buttonType: 'primary',
        onClick: onClickSaveColumnSelection,
        isLoading: viewInsurerPoliciesColumnSaveButtonLoaderAction,
      },
    ],
    [
      onClickResetDefaultColumnSelection,
      onClickCloseColumnSelection,
      onClickSaveColumnSelection,
      viewInsurerPoliciesColumnSaveButtonLoaderAction,
      viewInsurerPoliciesColumnResetButtonLoaderAction,
    ]
  );

  const onChangeSelectedColumn = useCallback(
    (type, name, value) => {
      const data = { type, name, value };
      dispatch(changeInsurerPoliciesColumnListStatus(data));
    },
    [dispatch]
  );

  const onSelectLimit = useCallback(
    newLimit => {
      getInsurerPoliciesList({ page: 1, limit: newLimit });
    },
    [getInsurerPoliciesList]
  );

  const pageActionClick = useCallback(
    newPage => {
      getInsurerPoliciesList({ page: newPage, limit });
    },
    [limit, getInsurerPoliciesList]
  );

  const [crmIds, setCrmIds] = useState([]);
  const [syncFromCRM, setSyncFromCRM] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);

  const toggleSyncWithCRM = useCallback(() => {
    setCrmIds([]);
    dispatch({
      type: INSURER_VIEW_REDUX_CONSTANT.POLICIES.INSURER_POLICY_SYNC_LIST_BY_SEARCH,
      data: [],
    });
    setSyncFromCRM(e => !e);
  }, [setSyncFromCRM, setCrmIds]);

  const syncDataFromCRM = useCallback(() => {
    dispatch({
      type: INSURER_VIEW_REDUX_CONSTANT.POLICIES.INSURER_POLICY_SYNC_LIST_BY_SEARCH,
      data: [],
    });
    const data = {
      clientIds: crmIds,
    };
    try {
      if (data?.clientIds?.length > 0) {
        startGeneralLoaderOnRequest('viewInsurerPoliciesSyncWithCRMButtonLoaderAction');
        InsurerPoliciesApiServices.syncInsurerPolicyList(id, data)
          .then(res => {
            if (res?.data?.status === 'SUCCESS') {
              successNotification(res?.data?.message ?? 'Policies synced successfully.');
              getInsurerPoliciesList();
              stopGeneralLoaderOnSuccessOrFail('viewInsurerPoliciesSyncWithCRMButtonLoaderAction');
              toggleSyncWithCRM();
            }
          })
          .catch(e => {
            stopGeneralLoaderOnSuccessOrFail('viewInsurerPoliciesSyncWithCRMButtonLoaderAction');
            errorNotification(e?.data?.message ?? 'Failed');
          });
      } else {
        errorNotification('Please select at least one policy to sync');
      }
    } catch (e) {
      /**/
    }
  }, [crmIds, getInsurerPoliciesList, setSyncFromCRM]);

  const syncWithCRMButtons = useMemo(
    () => [
      { title: 'Close', buttonType: 'primary-1', onClick: toggleSyncWithCRM },
      {
        title: 'Sync',
        buttonType: 'primary',
        onClick: syncDataFromCRM,
        isLoading: viewInsurerPoliciesSyncWithCRMButtonLoaderAction,
      },
    ],
    [toggleSyncWithCRM, syncDataFromCRM, viewInsurerPoliciesSyncWithCRMButtonLoaderAction]
  );

  const checkIfEnterKeyPressed = useCallback(
    e => {
      const searchKeyword = searchInputRef?.current?.value;
      if (searchKeyword?.trim()?.toString()?.length === 0 && e.key !== 'Enter') {
        getInsurerPoliciesList();
      } else if (e.key === 'Enter') {
        if (searchKeyword?.trim()?.toString()?.length !== 0) {
          getInsurerPoliciesList({ search: searchKeyword?.trim()?.toString() });
        } else {
          errorNotification('Please enter search text to search');
        }
      }
    },
    [getInsurerPoliciesList]
  );

  const checkIfEnterKeyPressedForPolicy = useCallback(async () => {
    const searchKeyword = searchInputRef?.current?.value;
    if (searchKeyword?.trim()?.toString()?.length > 0) {
      setIsModalLoading(true);
      await dispatch(getPolicySyncListForCRM(id, searchKeyword?.trim()?.toString()));
      setIsModalLoading(false);
    }
  }, [setIsModalLoading]);

  const selectPolicyFromCRMList = useCallback(
    crmId => {
      let arr = [...crmIds];
      if (arr?.includes(crmId)) {
        arr = arr?.filter(e => e !== crmId);
      } else if (crmIds?.length < 10) {
        arr = [...arr, crmId];
      } else {
        errorNotification('Maximum 10 policies can be synced at a time');
      }
      setCrmIds(arr);
    },
    [crmIds]
  );

  useEffect(() => {
    dispatch(getInsurerPoliciesColumnNameList());
  }, []);

  useEffect(() => {
    getInsurerPoliciesList();
  }, [id]);

  return (
    <>
      <div className="tab-content-header-row">
        <div className="tab-content-header">Policies</div>
        <div className="buttons-row">
          <BigInput
            ref={searchInputRef}
            type="text"
            className="search"
            borderClass="tab-search"
            prefix="search"
            prefixClass="font-placeholder"
            placeholder="Search here"
            onKeyUp={checkIfEnterKeyPressed}
          />
          <IconButton
            buttonType="primary"
            title="format_line_spacing"
            onClick={toggleCustomField}
          />
          <UserPrivilegeWrapper moduleName={SIDEBAR_NAMES.INSURER}>
            <UserPrivilegeWrapper moduleName="policy">
              <Button buttonType="secondary" title="Sync With CRM" onClick={toggleSyncWithCRM} />
            </UserPrivilegeWrapper>
          </UserPrivilegeWrapper>
        </div>
      </div>
      {/* eslint-disable-next-line no-nested-ternary */}
      {docs ? (
        docs.length > 0 ? (
          <>
            <div className="tab-table-container">
              <Table
                align="left"
                tableClass="white-header-table"
                valign="center"
                data={docs}
                headers={headers}
                refreshData={getInsurerPoliciesList}
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
        )
      ) : (
        <Loader />
      )}
      {customFieldModal && (
        <CustomFieldModal
          defaultFields={defaultFields}
          customFields={customFields}
          onChangeSelectedColumn={onChangeSelectedColumn}
          buttons={customFieldsModalButtons}
          toggleCustomField={toggleCustomField}
        />
      )}
      {syncFromCRM && (
        <Modal
          header="Sync With CRM"
          className="add-to-crm-modal"
          buttons={syncWithCRMButtons}
          hideModal={toggleSyncWithCRM}
        >
          <BigInput
            ref={searchInputRef}
            prefix="search"
            prefixClass="font-placeholder"
            placeholder="Search Client"
            type="text"
            onChange={_.debounce(checkIfEnterKeyPressedForPolicy, 1000)}
          />
          {!isModalLoading ? (
            <>
              <div className="crm-checkbox-list-container">
                {syncListFromCrm?.length > 0 ? (
                  syncListFromCrm?.map(crm => (
                    <Checkbox
                      title={crm?.name}
                      className="crm-checkbox-list"
                      checked={crmIds?.includes(crm?._id?.toString())}
                      onChange={() => selectPolicyFromCRMList(crm?._id?.toString())}
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
  );
};
export default InsurerPoliciesTab;
