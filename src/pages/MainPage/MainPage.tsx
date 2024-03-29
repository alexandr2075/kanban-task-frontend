import React, { FC, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '~/hooks/redux';
import {deleteBoard, getAllBoards, getAllUserBoards} from '~/services/boards';
import { setBoards } from '~/store/reducers/boardSlice';
import { getBoard } from '~/services/boards';
import { setCurrentBoard } from '~/store/reducers/currentBoardSlice';
import { BoardData } from '~/types/api';
import { SearchTasksProps } from '~/types/mainRoute';
import { searchAllTasks } from '~/services/tasks';
import BackspaceIcon from '@mui/icons-material/Backspace';
import { useTranslation } from 'react-i18next';
import ConfirmationModal from '~/components/ConfirmationModal';
import Button from '@mui/material/Button';
import { clearError } from '~/store/reducers/authSlice';
import { ToastContainer, toast } from 'react-toastify';
import SearchForm from '~/components/SearchForm/SearchForm';
import { searchCategory } from '~/utils/constants';
import Loader from '~/components/Loader';
import BoardEditModal from '~/components/BoardEditModal';

import styles from './MainPage.module.scss';

const MainPage: FC = () => {
  const { boards } = useAppSelector(state => state.boards);
  const { isLogged, error, userId } = useAppSelector(state => state.auth);
  const [countArr, setCountArr] = useState<BoardData[]>([]);
  const [isModalActive, setIsModalActive] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentBoardId, setCurrentBoardId] = useState('');

  const [pageState, setPageState] = useState({
    boardsOnPage: boards,
    state: false,
    boardOnDelete: '',
    isSearching: false,
    searchFlag: false,
    searchTasks: [] as SearchTasksProps[],
  });
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const resetSearch = () => {
    setPageState(prev => {
      return {
        ...prev,
        state: false,
        boardOnDelete: '',
        isSearching: false,
        searchFlag: false,
        searchTasks: [] as SearchTasksProps[],
      };
    });
  };

  const onModalClick = async (resp: boolean) => {
    setPageState(prev => {
      return { ...prev, isSearching: true };
    });
    if (resp) {
      const boardId = pageState.boardOnDelete;
      const deleteResp = await deleteBoard(boardId);
      if (deleteResp?.status === 204 || deleteResp?.status === 200) {
        dispatch(setBoards(boards.filter(board => board._id !== boardId)));
      }
    }
    setPageState(prev => {
      return { ...prev, state: false, boardOnDelete: '', isSearching: false };
    });
  };

  const openBoard = (boardId: string): void => {
    dispatch(setCurrentBoard(boards.find(board => board._id === boardId) as BoardData));
  };

  const tasksCount = (board: BoardData) => {
    const boardToCount = countArr.find(item => board._id === item._id) as BoardData;
    const columns = boardToCount?.columns?.length || 0;
    let tasksNumber = 0;
    columns
      ? boardToCount.columns?.forEach(item => {
          if (item.tasks) {
            tasksNumber += item.tasks.length;
          }
        })
      : 0;
    return { columns, tasksNumber };
  };

  const searchFilter = (category: string, searchVal: string, tasksArray: SearchTasksProps[]) => {
    switch (category) {
      case searchCategory.TITLE:
        return tasksArray.filter(task => task.title?.toLowerCase().includes(searchVal.toLowerCase()));
      case searchCategory.DESCRIPTION:
        return tasksArray.filter(task => task.description?.toLowerCase().includes(searchVal.toLowerCase()));
      case searchCategory.USER:
        return tasksArray.filter(task => task.userId?.includes(searchVal));
      default:
        return tasksArray.filter(task => task.title?.toLowerCase().includes(searchVal.toLowerCase()));
    }
  };

  const handleSearch = async (searchCategory: string, searchVal: string) => {

    setPageState(prev => {
      return { ...prev, searchTasks: [], searchFlag: false, isSearching: true };
    });
    const tasksArr = await searchAllTasks();
    if (Array.isArray(tasksArr?.data)) {
      const tasksModify = (tasksArr?.data as SearchTasksProps[]).map(task => {
        const boardTitle = boards.find(board => board._id === task.boardId);
        return { ...task, boardTitle: boardTitle?.title as string };
      });
      const tasksFilter = searchFilter(searchCategory, searchVal, tasksModify);

      setPageState(prev => {
        return { ...prev, searchFlag: true, searchTasks: [...tasksFilter], isSearching: false };
      });
    } else {
      setPageState(prev => {
        return { ...prev, searchFlag: true, isSearching: false };
      });
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      dispatch(clearError());
    }
  }, [dispatch, error]);

  useEffect(() => {
    if (isLogged) {
      setIsLoading(true);
      const getBoards = async (): Promise<void> => {
        const data = await getAllUserBoards(userId);
        // const data = await getAllBoards();
        if (Array.isArray(data)) {
          dispatch(setBoards(data as BoardData[]));
          const arr = await Promise.all(data.map(async item => await getBoard(item._id)));
          const arrFilter = arr.filter(item => item !== undefined) as BoardData[];
          setCountArr(arrFilter ? [...arrFilter] : []);
        }
        setIsLoading(false);
      };
      getBoards();
    }
  }, [dispatch, isLogged, isEdited]);

  return (
    <div className="container">
      <div className={styles.mainPage}>
        <div className={styles.main_route_sidebar}>
          <SearchForm callback={handleSearch} searchState={pageState.searchFlag} />
          {pageState.isSearching && <Loader />}
          {isLoading && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Loader />
            </div>
          )}
          {!isLoading && boards.length === 0 && <p className={styles.noBoardsText}>{t('MAIN_ROUTE.NO_BOARDS_TEXT')}</p>}
          {Array.isArray(boards) && !pageState.isSearching && !pageState.searchFlag && (
            <ul className={styles.list}>
              {boards.map((board: BoardData) => {
                return (
                  <li key={board._id} onClick={() => openBoard(board._id)} className={styles.boardWrapper}>
                    <NavLink to={`board/${board._id}`} className={styles.board}>
                      {countArr && (
                        <ul className={styles.list}>
                          <li className={styles.listItemTitle}>
                            {board.title.length > 23 ? board.title.substring(0, 20) + '...' : board.title}
                          </li>
                          <li className={styles.listItemDescr}>
                            {t('MAIN_ROUTE.BOARD_OWNER')}
                            {board.owner.length > 70
                              ? board.owner.substring(0, 67) + '...'
                              : board.owner}
                          </li>
                          <li className={styles.listItem}>
                            {t('MAIN_ROUTE.COLUMNS_COUNT')} {tasksCount(board).columns}
                          </li>
                          <li className={styles.listItem}>
                            {t('MAIN_ROUTE.TASKS_COUNT')} {tasksCount(board).tasksNumber}
                          </li>
                        </ul>
                      )}
                    </NavLink>
                    <div className={styles.deleteIcon_wrapper}>
                      <BackspaceIcon
                        color="error"
                        className={styles.deleteIcon}
                        onClick={() =>
                          setPageState(prev => {
                            return { ...prev, state: true, boardOnDelete: board._id };
                          })
                        }
                      />
                    </div>
                    <button
                      className={styles.editBtn}
                      onClick={() => {
                        setIsModalActive(true);
                        setCurrentBoardId(board._id);
                      }}
                    ></button>
                  </li>
                );
              })}
            </ul>
          )}
          {pageState.searchFlag && pageState.searchTasks.length !== 0 && (
            <>
              <div className={styles.back}>
                <Button variant="outlined" type="button" onClick={resetSearch}>
                  ← {t('BOARD.BUTTON_BACK')}
                </Button>
              </div>
              <ul className={styles.tasksWrapper}>
                {pageState.searchTasks.map((value, index) => {
                  return (
                    <li
                      key={value.boardId + index * 11}
                      className={styles.taskItem}
                      onClick={() => openBoard(value.boardId)}
                    >
                      <NavLink to={`/board/${value.boardId}`} className={styles.search_task}>
                        <div className={styles.searchResultWrapper}>
                          <p className={styles.searchResultTitle}>{t('MAIN_ROUTE.BOARD_TITLE')}</p>
                          <p className={styles.searchResultText}>
                            {value.boardTitle && value.boardTitle.length > 26
                              ? value?.boardTitle?.substring(0, 23) + '...'
                              : value.boardTitle}
                          </p>
                        </div>
                        <div className={styles.searchResultWrapper}>
                          <p className={styles.searchResultTitle}>{t('MAIN_ROUTE.TASK_TITLE')}</p>
                          <p className={styles.searchResultText}>
                            {value.title && value.title.length > 26
                              ? value?.title?.substring(0, 23) + '...'
                              : value.title}
                          </p>
                        </div>
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
          {pageState.searchFlag && pageState.searchTasks.length === 0 && (
            <div className={styles.search_no_tasks}>
              <div className={styles.back}>
                <Button variant="outlined" type="button" onClick={resetSearch}>
                  ← {t('BOARD.BUTTON_BACK')}
                </Button>
              </div>
              <p className={styles.noTasksText}>{t('MAIN_ROUTE.NO_TASKS_FOUND')}</p>
            </div>
          )}
        </div>
        <ConfirmationModal callback={onModalClick} text={t('MAIN_ROUTE.DELETE_MESSAGE')} isActive={pageState.state} />
        <div style={{ height: '110px' }}></div>
        <ToastContainer />
        <BoardEditModal
          isActive={isModalActive}
          setIsActive={setIsModalActive}
          boardId={currentBoardId}
          setIsEdited={setIsEdited}
        />
      </div>
    </div>
  );
};

export default MainPage;
