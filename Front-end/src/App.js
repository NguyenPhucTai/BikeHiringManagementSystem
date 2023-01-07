import React, { Fragment } from "react";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
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
			{/* <Footer /> */}
		</BrowserRouter>
	);
}

/** Access admin page */
function PrivateRoute({ children }) {
	return (
		<BrowserRouter>
			{/* <MenuBar /> */}
			<Routes>{children}</Routes>
		</BrowserRouter>
	);
}

function App() {
	// return (
	// 	<Fragment>
	// 		<BrowserRouter>
	// 			<Routes>
	// 				{cookies.get('accessToken') &&
	// 					<Route path='/dashboard' exact element={<Dashboard />} />
	// 				}
	// 				<Route path='/signin' exact element={<SignIn />} />
	// 				{/* <Route path='*' element={<Navigate to='/404' />} />
	// 				<Route path='/404' exact element={<PageNotFound warn={"Website is developed"} />} /> */}
	// 			</Routes>
	// 		</BrowserRouter>
	// 	</Fragment>
	// )
	// if (cookies.get('accessToken')) {
	// 	return (
	// 		<Fragment>
	// 			<PrivateRoute>
	// 				<Route path='/dashboard' exact element={<Dashboard />} />
	// 				<Route path='/manage/category' exact element={<ManageBikeCategory />} />
	// 				<Route path='/manage/color' exact element={<ManageBikeColor />} />
	// 				<Route path='/manage/manufacturer' exact element={<ManageBikeManufacturer />} />
	// 				<Route path='/manage/bike' exact element={<ManageBikeList />} />
	// 				<Route path='/manage/bike/create' exact element={<ManageBikeCreate />} />
	// 				<Route path='/manage/bike/update/:id' exact element={<ManageBikeUpdate />} />
	// 				<Route path='/manage/bike/:id' element={<ManageBikeDetail />} />
	// 				<Route path='*' element={<Navigate to='/404' />} />
	// 				<Route path='/404' exact element={<PageNotFound warn={"Website is developed"} />} />
	// 			</PrivateRoute>
	// 			{/* <GlobalRoute>
	// 				<Route path='/' exact element={<Home />} />
	// 				<Route path='/list' exact element={<List />} />
	// 				<Route path='/list/manual' exact element={<List category={2} />} />
	// 				<Route path='/list/automatic' exact element={<List category={1} />} />
	// 				<Route path='/bike/:id' element={<Detail />} />
	// 				<Route path='/signin' exact element={<SignIn />} />
	// 			</GlobalRoute> */}
	// 		</Fragment>
	// 	)
	// } else {
	// 	return (
	// 		<Fragment>
	// 			<GlobalRoute>
	// 				<Route path='/' exact element={<Home />} />
	// 				<Route path='/list' exact element={<List />} />
	// 				<Route path='/list/manual' exact element={<List category={2} />} />
	// 				<Route path='/list/automatic' exact element={<List category={1} />} />
	// 				<Route path='/bike/:id' element={<Detail />} />
	// 				<Route path='/signin' exact element={<SignIn />} />
	// 				<Route path='*' element={<Navigate to='/404' />} />
	// 				<Route path='/404' exact element={<PageNotFound warn={"Website is developed"} />} />
	// 			</GlobalRoute>
	// 		</Fragment>
	// 	)
	// }
	return (
		<Fragment>
			<GlobalRoute>
				<Route path='/' exact element={<Home />} />
				<Route path='/list' exact element={<List />} />
				<Route path='/list/manual' exact element={<List category={2} />} />
				<Route path='/list/automatic' exact element={<List category={1} />} />
				<Route path='/bike/:id' element={<Detail />} />
				<Route path='/signin' exact element={<SignIn />} />

				<Route path='/dashboard' exact element={<Dashboard />} />
				<Route path='/manage/category' exact element={<ManageBikeCategory />} />
				<Route path='/manage/color' exact element={<ManageBikeColor />} />
				<Route path='/manage/manufacturer' exact element={<ManageBikeManufacturer />} />
				<Route path='/manage/bike' exact element={<ManageBikeList />} />
				<Route path='/manage/bike/create' exact element={<ManageBikeCreate />} />
				<Route path='/manage/bike/update/:id' exact element={<ManageBikeUpdate />} />
				<Route path='/manage/bike/:id' element={<ManageBikeDetail />} />

				<Route path='*' element={<Navigate to='/404' />} />
				<Route path='/404' exact element={<PageNotFound warn={"Website is developed"} />} />
			</GlobalRoute>
		</Fragment>
	)
}

export default App;
