import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import _ from 'lodash';
import IconButton from '../../../common/IconButton/IconButton';
import BigInput from '../../../common/BigInput/BigInput';
import Table from '../../../common/Table/Table';
import Pagination from '../../../common/Pagination/Pagination';
import CustomFieldModal from '../../../common/Modal/CustomFieldModal/CustomFieldModal';
import Loader from '../../../common/Loader/Loader';
import { errorNotification } from '../../../common/Toast';
import {
  changeClientApplicationColumnListStatus,
  downloadClientTabApplicationCSV,
  getClientApplicationColumnNameList,
  getClientApplicationListData,
  saveClientApplicationColumnNameList,
} from '../redux/ClientAction';
import { CLIENT_REDUX_CONSTANTS } from '../redux/ClientReduxConstants';
import { downloadAll } from '../../../helpers/DownloadHelper';

const ClientApplicationTab = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const searchInputRef = useRef();
  const {
    applicationList,
    clientApplicationColumnNameList,
    clientApplicationDefaultColumnNameList,
  } = useSelector(({ clientManagement }) => clientManagement?.application ?? {});

  const {
    viewClientApplicationColumnSaveButtonLoaderAction,
    viewClientApplicationColumnResetButtonLoaderAction,
    ClientDownloadApplicationCSVButtonLoaderAction,
  } = useSelector(({ generalLoaderReducer }) => generalLoaderReducer ?? false);

  const { total, headers, pages, docs, page, limit } = useMemo(
    () => applicationList ?? {},
    [applicationList]
  );

  const getClientApplicationList = useCallback(
    (params = {}, cb) => {
      const data = {
        page: page ?? 1,
        limit: limit ?? 15,
        ...params,
      };
      dispatch(getClientApplicationListData(id, data));
      if (cb && typeof cb === 'function') {
        cb();
      }
    },
    [page, limit, id]
  );

  const onSelectLimit = useCallback(
    newLimit => {
      getClientApplicationList({ page: 1, limit: newLimit });
    },
    [getClientApplicationList]
  );

  const pageActionClick = useCallback(
    newPage => {
      getClientApplicationList({ page: newPage, limit });
    },
    [limit, getClientApplicationList]
  );

  const [customFieldModal, setCustomFieldModal] = React.useState(false);
  const toggleCustomField = () => setCustomFieldModal(e => !e);

  const onChangeSelectedColumn = useCallback(
    (type, name, value) => {
      const data = { type, name, value };
      dispatch(changeClientApplicationColumnListStatus(data));
    },
    [dispatch]
  );

  const onClickResetDefaultColumnSelection = useCallback(async () => {
    await dispatch(saveClientApplicationColumnNameList({ isReset: true }));
    dispatch(getClientApplicationColumnNameList());
    getClientApplicationList();
    toggleCustomField();
  }, [dispatch, toggleCustomField, getClientApplicationList]);

  const onClickSaveColumnSelection = useCallback(async () => {
    try {
      const isBothEqual = _.isEqual(
        clientApplicationColumnNameList,
        clientApplicationDefaultColumnNameList
      );
      if (!isBothEqual) {
        await dispatch(saveClientApplicationColumnNameList({ clientApplicationColumnNameList }));
        getClientApplicationList();
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
    getClientApplicationList,
    clientApplicationColumnNameList,
    clientApplicationDefaultColumnNameList,
  ]);

  const onClickCloseColumnSelection = useCallback(() => {
    dispatch({
      type: CLIENT_REDUX_CONSTANTS.APPLICATION.CLIENT_APPLICATION_COLUMN_LIST_ACTION,
      data: clientApplicationDefaultColumnNameList,
    });
    toggleCustomField();
  }, [clientApplicationDefaultColumnNameList, toggleCustomField]);

  const { defaultFields, customFields } = useMemo(
    () => clientApplicationColumnNameList ?? { defaultFields: [], customFields: [] },
    [clientApplicationColumnNameList]
  );

  const buttons = useMemo(
    () => [
      {
        title: 'Reset Defaults',
        buttonType: 'outlined-primary',
        onClick: onClickResetDefaultColumnSelection,
        isLoading: viewClientApplicationColumnResetButtonLoaderAction,
      },
      { title: 'Close', buttonType: 'primary-1', onClick: onClickCloseColumnSelection },
      {
        title: 'Save',
        buttonType: 'primary',
        onClick: onClickSaveColumnSelection,
        isLoading: viewClientApplicationColumnSaveButtonLoaderAction,
      },
    ],
    [
      onClickResetDefaultColumnSelection,
      onClickCloseColumnSelection,
      onClickSaveColumnSelection,
      viewClientApplicationColumnSaveButtonLoaderAction,
      viewClientApplicationColumnResetButtonLoaderAction,
    ]
  );

  useEffect(() => {
    dispatch(getClientApplicationColumnNameList());
  }, []);

  useEffect(() => {
    getClientApplicationList();
  }, [id]);

  const checkIfEnterKeyPressed = e => {
    const searchKeyword = searchInputRef?.current?.value;
    if (searchKeyword?.trim()?.toString()?.length === 0 && e.key !== 'Enter') {
      getClientApplicationList();
    } else if (e.key === 'Enter') {
      if (searchKeyword?.trim()?.toString()?.length !== 0) {
        getClientApplicationList({ search: searchKeyword?.trim()?.toString() });
      } else {
        errorNotification('Please enter search text to search');
      }
    }
  };

  const onClickDownloadButton = useCallback(async () => {
    if (docs?.length > 0) {
      try {
        const res = await dispatch(downloadClientTabApplicationCSV(id));
        if (res) downloadAll(res);
      } catch (e) {
        errorNotification(e?.response?.request?.statusText ?? 'Internal server error');
      }
    } else {
      errorNotification('You have no records to download');
    }
  }, [docs, id]);

  return (
    <>
      <div className="tab-content-header-row">
        <div className="tab-content-header">Application</div>
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
          <IconButton
            buttonType="primary-1"
            title="cloud_download"
            className="mr-10"
            buttonTitle="Click to download applications"
            onClick={onClickDownloadButton}
            isLoading={ClientDownloadApplicationCSVButtonLoaderAction}
          />
        </div>
      </div>
      {/* eslint-disable-next-line no-nested-ternary */}
      {docs ? (
        docs.length > 0 ? (
          <>
            <div className="tab-table-container">
              <Table
                align="left"
                valign="center"
                tableClass="white-header-table"
                data={docs}
                headers={headers}
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
          buttons={buttons}
          toggleCustomField={toggleCustomField}
        />
      )}
    </>
  );
};

export default ClientApplicationTab;
