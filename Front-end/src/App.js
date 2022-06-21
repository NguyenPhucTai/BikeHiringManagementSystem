import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import React, { Fragment } from "react";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import './styles/style.scss';
import { useSelector } from "react-redux";
import PageNotFound from "./404";

/** Access page before login */
function GlobalRoute({ children }) {
	return (
		<BrowserRouter>
			<Routes>{children}</Routes>
		</BrowserRouter>
	);
}

/** Access page after login */
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
				<Route path='*' element={<Navigate to='/404' />} />
				<Route path='/404' exact element={<PageNotFound warn={"Website is developed"} />} />
			</GlobalRoute>
		</Fragment>
	)
}

export default App;
