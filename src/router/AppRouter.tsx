import React, { FC, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Logout from '~/components/Logout';
import { useAppSelector } from '~/hooks/redux';
import ErrorBoundary from '~/components/ErrorBoundary';
import Loader from '~/components/Loader';

import LoginPage from '~/pages/LoginPage';
import SignupPage from '~/pages/SignupPage';
import EditProfilePage from '~/pages/EditProfilePage';
import Board from '~/components/Board';
import MainPage from '~/pages/MainPage';
import WelcomePage from '~/pages/WelcomePage';

const AppRouter: FC = () => {
  const { isLogged } = useAppSelector(state => state.auth);

  return (
    <ErrorBoundary>
      <Suspense
        fallback={
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
        }
      >
        <Routes>
          {isLogged ? (
            <>
              <Route index element={<MainPage />} />
              <Route path="logout" element={<Logout />} />
              <Route path="profile" element={<EditProfilePage />} />
              <Route path="board/:id" element={<Board />} />
              <Route path="welcome" element={<WelcomePage />} />
            </>
          ) : (
            <>
              <Route index element={<WelcomePage />} />
              <Route path="signin" element={<LoginPage />} />
              <Route path="signup" element={<SignupPage />} />
            </>
          )}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

export default AppRouter;
