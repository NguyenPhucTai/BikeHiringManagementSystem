import React, { Fragment, useEffect, useState } from "react";
import { Routes, Route, BrowserRouter, Navigate, Outlet } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import './styles/style.scss';
import Cookies from 'universal-cookie';

import PageNotFound from './pages/404';
import MenuBar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';

// user page
import Home from './pages/user-page/Home';
import List from "./pages/user-page/List";
import Detail from "./pages/user-page/Detail";

// admin page
import SignIn from "./pages/admin-page/SignIn";
import Dashboard from "./pages/admin-page/Dashboard";
import ManageBikeCategory from "./pages/admin-page/ManageBikeCategory";
import ManageBikeColor from "./pages/admin-page/ManageBikeColor";
import ManageBikeManufacturer from "./pages/admin-page/ManageBikeManufacturer";
import ManageBikeList from "./pages/admin-page/ManageBikeList";
import ManageBikeCreate from "./pages/admin-page/ManageBikeCreate";
import ManageBikeDetail from "./pages/admin-page/ManageBikeDetail";
import ManageBikeUpdate from "./pages/admin-page/ManageBikeUpdate";

const cookies = new Cookies();

/** Access user page */
function GlobalRoute({ children }) {
	return (
		<BrowserRouter>
			<MenuBar />
			<Routes>{children}</Routes>
			<Footer />
		</BrowserRouter>
	);
}

/** Access admin page */
function PrivateRoute({ children }) {
	return (
		<BrowserRouter>
			<Routes>{children}</Routes>
		</BrowserRouter>
	);
}

const ProtectedRoute = ({ token, redirectPath = '/signin' }) => {
	console.log(token);
	if (!token) {
		return <Navigate to={redirectPath} replace />;
	}
	return <Outlet />;
};

function App() {

	const [token, setToken] = useState(null);

	if (token == null && cookies.get('accessToken')) {
		setToken(cookies.get('accessToken'))
	}

	return (
		<Fragment>
			<BrowserRouter>
				<MenuBar />
				<Routes>
					<Route path='/signin' exact element={<SignIn setToken={setToken} />} />
					<Route path='/' exact element={<Home />} />
					<Route path='/list' exact element={<List />} />
					<Route path='/list/manual' exact element={<List category={2} />} />
					<Route path='/list/automatic' exact element={<List category={1} />} />
					<Route path='/bike/:id' element={<Detail />} />
					<Route path='*' element={<Navigate to='/404' />} />
					<Route path='/404' exact element={<PageNotFound warn={"Website is developed"} />} />

					<Route element={<ProtectedRoute token={token} />}>
						<Route path='/dashboard' element={<Dashboard />} />
						<Route path='/manage/category' exact element={<ManageBikeCategory />} />
						<Route path='/manage/color' exact element={<ManageBikeColor />} />
						<Route path='/manage/manufacturer' exact element={<ManageBikeManufacturer />} />
						<Route path='/manage/bike' exact element={<ManageBikeList />} />
						<Route path='/manage/bike/create' exact element={<ManageBikeCreate />} />
						<Route path='/manage/bike/update/:id' exact element={<ManageBikeUpdate />} />
						<Route path='/manage/bike/:id' element={<ManageBikeDetail />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</Fragment>
	)
}

export default App;
