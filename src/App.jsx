import Home from './pages/home'
import Report from './pages/report'
import { Suspense } from "react";
import React from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

function App() {

  const HomePage = React.lazy(() => import("./pages/home"));

  const ReportPage = React.lazy(() => import("./pages/report"));

  const LoginPage = React.lazy(() => import("./pages/login"));

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Suspense fallback="loading..."><HomePage/></Suspense>} />
        <Route path="reports" element={<Suspense fallback="loading..."><ReportPage/></Suspense>} />
        <Route path="login" element={<Suspense fallback="loading..."><LoginPage/></Suspense>}/>
        <Route path="*" element={<Suspense fallback="loading..."><h1>Error 404</h1></Suspense>} />
      </Routes>
    </BrowserRouter>
);
}

export default App
