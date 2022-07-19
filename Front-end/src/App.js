import React, { Fragment } from "react";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import './styles/style.scss';
// import { useSelector } from "react-redux";
import PageNotFound from './pages/404';
import MenuBar from './components/Navbar/Navbar';
import Home from './pages/user-page/Home';
import SignIn from "./pages/admin-page/SignIn";
import Test from "./pages/test";
import TestUploadImage from './pages/test2';

/** Access user page */
function GlobalRoute({ children }) {
	return (
		<BrowserRouter>
			<MenuBar />
			<Routes>{children}</Routes>
		</BrowserRouter>
	);
}

/** Access admin page */
function PrivateRoute({ children }) {
	return (
		<Fragment>
			<BrowserRouter>
				{/* <MenuBar /> */}
				<Routes>{children}</Routes>
			</BrowserRouter>
		</Fragment>
	);
}

function App() {
	return (
		<Fragment>
			<GlobalRoute>
				<Route path='/' exact element={<Home />} />
				<Route path='/signin' exact element={<SignIn />} />
				<Route path='/test' exact element={<Test />} />
				<Route path='/test2' exact element={<TestUploadImage />} />
				<Route path='*' element={<Navigate to='/404' />} />
				<Route path='/404' exact element={<PageNotFound warn={"Website is developed"} />} />
			</GlobalRoute>
		</Fragment>
	)
}

export default App;
