import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { useHistory } from 'react-router-dom';
import IconButton from '../../../common/IconButton/IconButton';
import Button from '../../../common/Button/Button';
import Table from '../../../common/Table/Table';
import Pagination from '../../../common/Pagination/Pagination';
import {
  changeClaimsColumnList,
  getClaimsColumnsList,
  getClaimsEntityList,
  getClaimsFilterDropDownDataBySearch,
  getClaimsListByFilter,
  resetClaimListData,
  saveClaimsColumnsList,
} from '../redux/ClaimsAction';
import Loader from '../../../common/Loader/Loader';
import { useQueryParams } from '../../../hooks/GetQueryParamHook';
import CustomFieldModal from '../../../common/Modal/CustomFieldModal/CustomFieldModal';
import { errorNotification } from '../../../common/Toast';
import { CLAIMS_REDUX_CONSTANTS } from '../redux/ClaimsReduxConstants';
import Modal from '../../../common/Modal/Modal';
import { useUrlParamsUpdate } from '../../../hooks/useUrlParamsUpdate';
import { filterReducer, LIST_FILTER_REDUCER_ACTIONS } from '../../../common/ListFilters/Filter';
import { saveAppliedFilters } from '../../../common/ListFilters/redux/ListFiltersAction';
import Select from '../../../common/Select/Select';
import { useModulePrivileges } from '../../../hooks/userPrivileges/useModulePrivilegesHook';
import { SIDEBAR_NAMES } from '../../../constants/SidebarConstants';

const ClaimsList = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [customFieldModal, setCustomFieldModal] = useState(false);
  const [filterModal, setFilterModal] = useState(false);
  const isClaimUpdatable = useModulePrivileges(SIDEBAR_NAMES.CLAIM).hasWriteAccess;
  const toggleFilterModal = useCallback(
    value => setFilterModal(value !== undefined ? value : e => !e),
    [setFilterModal]
  );

  const { claimsListFilters } = useSelector(({ listFilterReducer }) => listFilterReducer ?? {});
  const [filter, dispatchFilter] = useReducer(filterReducer, {
    tempFilter: {},
    finalFilter: {},
  });
  const { tempFilter, finalFilter } = useMemo(() => filter ?? {}, [filter]);
  const handleEntityNameFilterChange = useCallback(event => {
    dispatchFilter({
      type: LIST_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
      name: 'clientId',
      value: event,
    });
  }, []);
  const claimsList = useSelector(({ claims }) => claims?.claimsList ?? {});
  const claimsColumnList = useSelector(({ claims }) => claims?.claimsColumnList ?? {});
  const claimsDefaultColumnList = useSelector(
    ({ claims }) => claims?.claimsDefaultColumnList ?? {}
  );
  const {
    claimsListColumnSaveButtonLoaderAction,
    claimsListColumnResetButtonLoaderAction,
    claimListLoader,
  } = useSelector(({ generalLoaderReducer }) => generalLoaderReducer ?? false);
  const filterDropdownClient = useSelector(({ claims }) => claims?.claimsEntityList ?? []);
  const { total, pages, page, limit, docs, headers } = useMemo(() => claimsList, [claimsList]);

  const { defaultFields, customFields } = useMemo(
    () =>
      claimsColumnList || {
        defaultFields: [],
        customFields: [],
      },
    [claimsColumnList]
  );

  const { page: paramPage, limit: paramLimit } = useQueryParams();

  const getClaimsByFilter = useCallback(
    async (initialParams = { page: 1, limit: 15 }) => {
      const params = {
        page: page ?? 1,
        limit: limit ?? 15,
        ...initialParams,
        clientId:
          (tempFilter?.clientId?.value?.toString()?.trim()?.length ?? -1) > 0
            ? tempFilter?.clientId
            : undefined,
      };
      await dispatch(getClaimsListByFilter(params));
      dispatchFilter({
        type: LIST_FILTER_REDUCER_ACTIONS.APPLY_DATA,
      });
    },
    [page, limit, { ...tempFilter }]
  );

  const onClickApplyFilter = useCallback(async () => {
    toggleFilterModal();
    await getClaimsByFilter({ page: 1, limit });
  }, [getClaimsByFilter, toggleFilterModal, limit]);

  const onClickResetFilter = useCallback(async () => {
    dispatchFilter({
      type: LIST_FILTER_REDUCER_ACTIONS.RESET_STATE,
    });
    await onClickApplyFilter();
  }, []);

  const filterModalButtons = useMemo(
    () => [
      {
        title: 'Reset Defaults',
        buttonType: 'outlined-primary',
        onClick: onClickResetFilter,
      },
      {
        title: 'Close',
        buttonType: 'primary-1',
        onClick: () => {
          dispatchFilter({
            type: LIST_FILTER_REDUCER_ACTIONS.CLOSE_FILTER,
          });
          toggleFilterModal();
        },
      },
      { title: 'Apply', buttonType: 'primary', onClick: onClickApplyFilter },
    ],
    [toggleFilterModal, onClickApplyFilter, onClickResetFilter]
  );

  const toggleCustomField = useCallback(
    value => setCustomFieldModal(value !== undefined ? value : e => !e),
    [setCustomFieldModal]
  );

  const onClickResetDefaultColumnSelection = useCallback(async () => {
    await dispatch(saveClaimsColumnsList({ isReset: true }));
    dispatch(getClaimsColumnsList());
    await getClaimsByFilter();
    toggleCustomField();
  }, [toggleCustomField, getClaimsByFilter]);

  const onClickCloseColumnSelection = useCallback(() => {
    dispatch({
      type: CLAIMS_REDUX_CONSTANTS.GET_CLAIMS_COLUMNS_LIST,
      data: claimsDefaultColumnList,
    });
    toggleCustomField();
  }, [toggleCustomField, claimsDefaultColumnList]);

  const onClickSaveColumnSelection = useCallback(async () => {
    try {
      const isBothEqual = _.isEqual(claimsColumnList, claimsDefaultColumnList);
      if (!isBothEqual) {
        await dispatch(saveClaimsColumnsList({ claimsColumnList }));
        await getClaimsByFilter();
      } else {
        errorNotification('Please select different columns to apply changes.');
        throw Error();
      }
      toggleCustomField();
    } catch (e) {
      /**/
    }
  }, [toggleCustomField, claimsDefaultColumnList, getClaimsByFilter, claimsColumnList]);

  const customFieldsModalButtons = useMemo(
    () => [
      {
        title: 'Reset Defaults',
        buttonType: 'outlined-primary',
        onClick: onClickResetDefaultColumnSelection,
        isLoading: claimsListColumnResetButtonLoaderAction,
      },
      { title: 'Close', buttonType: 'primary-1', onClick: onClickCloseColumnSelection },
      {
        title: 'Save',
        buttonType: 'primary',
        onClick: onClickSaveColumnSelection,
        isLoading: claimsListColumnSaveButtonLoaderAction,
      },
    ],
    [
      onClickResetDefaultColumnSelection,
      onClickCloseColumnSelection,
      onClickSaveColumnSelection,
      claimsListColumnSaveButtonLoaderAction,
      claimsListColumnResetButtonLoaderAction,
    ]
  );

  const onChangeSelectedColumn = useCallback((type, name, value) => {
    const data = { type, name, value };
    dispatch(changeClaimsColumnList(data));
  }, []);

  const onSelectLimit = useCallback(
    newLimit => {
      getClaimsByFilter({ page: 1, limit: newLimit });
    },
    [getClaimsByFilter]
  );

  const pageActionClick = useCallback(
    newPage => {
      getClaimsByFilter({ page: newPage, limit });
    },
    [limit, getClaimsByFilter]
  );

  const addClaims = useCallback(() => {
    history.replace('/claims/add');
  }, [history]);

  const viewClaim = useCallback(
    id => {
      history.replace(`claims/view/${id}`);
    },
    [history]
  );

  useUrlParamsUpdate(
    {
      page: page ?? 1,
      limit: limit ?? 15,
      clientId:
        (finalFilter?.clientId?.value?.toString()?.trim()?.length ?? -1) > 0
          ? finalFilter?.clientId?.value
          : undefined,
    },
    [page, limit, finalFilter]
  );

  useEffect(async () => {
    const data = {
      page: paramPage ?? page ?? 1,
      limit: paramLimit ?? limit ?? 15,
    };
    const filters = {
      clientId: claimsListFilters?.clientId,
    };
    Object.entries(filters).forEach(([name, value]) => {
      dispatchFilter({
        type: LIST_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
        name,
        value,
      });
    });
    await getClaimsByFilter({ ...data, ...filters });
    dispatch(getClaimsColumnsList());
    dispatch(getClaimsEntityList());
    return () => {
      dispatch(resetClaimListData());
    };
  }, []);

  const handleOnSelectSearchInputChange = useCallback((searchEntity, text) => {
    const options = {
      searchString: text,
      entityType: searchEntity,
      requestFrom: 'claim',
    };
    dispatch(getClaimsFilterDropDownDataBySearch(options));
  }, []);

  useEffect(() => {
    dispatch(saveAppliedFilters('claimsListFilters', finalFilter));
  }, [finalFilter]);

  return (
    <>
      {!claimListLoader ? (
        <>
          <div className="page-header">
            <div className="page-header-name">Claims List</div>
            <div className="page-header-button-container">
              <IconButton
                buttonType="secondary"
                title="filter_list"
                className="mr-10"
                buttonTitle="Click to apply filters on claim list"
                onClick={() => toggleFilterModal()}
              />
              <IconButton
                buttonType="primary"
                title="format_line_spacing"
                className="mr-10"
                buttonTitle="Click to select custom fields"
                onClick={() => toggleCustomField()}
              />
              {isClaimUpdatable && <Button title="Add" buttonType="success" onClick={addClaims} />}
            </div>
          </div>
          {docs?.length > 0 ? (
            <>
              <div className="common-list-container">
                <Table
                  align="left"
                  valign="center"
                  data={docs}
                  headers={headers}
                  tableClass="main-list-table"
                  rowClass="cursor-pointer"
                  recordSelected={viewClaim}
                />
              </div>
              <Pagination
                className="common-list-pagination"
                total={total}
                pages={pages}
                page={page}
                limit={limit}
                onSelectLimit={onSelectLimit}
                pageActionClick={pageActionClick}
              />
            </>
          ) : (
            <div className="no-record-found">No record found</div>
          )}
          {customFieldModal && (
            <CustomFieldModal
              defaultFields={defaultFields}
              customFields={customFields}
              buttons={customFieldsModalButtons}
              onChangeSelectedColumn={onChangeSelectedColumn}
              toggleCustomField={toggleCustomField}
            />
          )}
          {filterModal && (
            <Modal
              headerIcon="filter_list"
              header="Filter"
              buttons={filterModalButtons}
              className="filter-modal application-filter-modal"
            >
              <div className="filter-modal-row">
                <div className="form-title">Clients</div>
                <Select
                  className="filter-select"
                  placeholder="Select"
                  name="client"
                  options={filterDropdownClient}
                  value={tempFilter?.clientId}
                  onChange={handleEntityNameFilterChange}
                  isSearchable
                  onInputChange={text => handleOnSelectSearchInputChange('clients', text)}
                />
              </div>
            </Modal>
          )}
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};
export default ClaimsList;
