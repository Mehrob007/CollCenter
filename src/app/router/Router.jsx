// import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// const Layout = lazy(() => import('../../components/layout/Layout'));
// const Login = lazy(() => import('../../components/login/Login'));

// const Coll = lazy(() => import('../../components/layout/page/Coll'));
// const Mess = lazy(() => import('../../components/layout/page/Mess'));
// const Task = lazy(() => import('../../components/layout/page/Task'));
// const Contacts = lazy(() => import('../../components/layout/page/Сontacts'));
// const Magazine = lazy(() => import('../../components/layout/page/Magazine'));
// const AutoRedial = lazy(() => import('../../components/layout/page/AutoRedial'));
// const WriteLetter = lazy(() => import('../../components/layout/page/WriteLetter'));
// const CreateTask = lazy(() => import('../../components/layout/page/CreateTask'));

import Layout from '../../components/layout/Layout'
import Login from '../../components/login/Login'
import Coll from '../../components/layout/page/Coll'
import Mess from '../../components/layout/page/Mess'
import Task from '../../components/layout/page/Task'
import Contacts from '../../components/layout/page/Сontacts'
import Magazine from '../../components/layout/page/Magazine'
import AutoRedial from '../../components/layout/page/AutoRedial'
import WriteLetter from '../../components/layout/page/WriteLetter'
import CreateTask from '../../components/layout/page/CreateTask'
import Menejment from '../../components/layout/page/pageDop/Menejment';
import Otchot from '../../components/layout/page/pageDop/Otchot';

export default function Router() {
  
  return (
    // <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/login" element={!localStorage.getItem('refreshToken') ? <Login /> : <Navigate to="/" replace />} />
        <Route
          path="/"
          element={localStorage.getItem('refreshToken') ? <Layout /> : <Navigate to="/login" replace />}
        >
          <Route index element={<Coll />} />
          <Route path='/' element={<Coll />} />
          <Route path='/:numbers' element={<Coll />} />
          <Route path="auto-redial" element={<AutoRedial />} />
          <Route path="write-letter" element={<WriteLetter />} />
          <Route path="write-letter/:Email" element={<WriteLetter />} />
          <Route path="create-task" element={<CreateTask />} />
          <Route path="message" element={<Mess />} />
          <Route path="task" element={<Task />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="magazine" element={<Magazine />} />
          <Route path="menejment" element={<Menejment />} />
          <Route path="otchot" element={<Otchot />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    // </Suspense>
  );
}
