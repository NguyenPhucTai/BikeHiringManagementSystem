import React, { Fragment } from "react";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import './styles/style.scss';
// import { useSelector } from "react-redux";
import PageNotFound from './pages/404';
import MenuBar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './pages/user-page/Home';
import List from "./pages/user-page/List";
import Detail from "./pages/user-page/Detail";
import SignIn from "./pages/admin-page/SignIn";
import Test from "./pages/test";
import TestUploadImage from './pages/test2';
import ManageBikeCategory from "./pages/admin-page/ManageBikeCategory";
import TestPopupPage from "./pages/TestPopupPage";
import ManageBikeColor from "./pages/admin-page/ManageBikeColor";

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
				<Route path='/list' exact element={<List />} />
				<Route path='/list/manual' exact element={<List category={2} />} />
				<Route path='/list/automatic' exact element={<List category={1} />} />
				<Route path='/bike/:id' element={<Detail />} />
				<Route path='/signin' exact element={<SignIn />} />
				<Route path='/test' exact element={<Test />} />
				<Route path='/test2' exact element={<TestUploadImage />} />
				<Route path='*' element={<Navigate to='/404' />} />
				<Route path='/404' exact element={<PageNotFound warn={"Website is developed"} />} />
				<Route path='/manage/category' exact element={<ManageBikeCategory />} />
				<Route path='/manage/color' exact element={<ManageBikeColor />} />
				{/* <Route path='/testpopup' exact element={<TestPopupPage />} /> */}
			</GlobalRoute>
		</Fragment>
	)
}

export default App;
