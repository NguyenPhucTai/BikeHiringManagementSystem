import React, { Fragment, useEffect, useState } from 'react';
import { TableCRUD } from '../../components/Table/TableCRUD';
import { AxiosInstance } from "../../api/AxiosClient";
import Cookies from 'universal-cookie';
import { CategoryManagement } from '../../api/EndPoint';
import SortBar from "../../components/Navbar/SortBar";

const cookies = new Cookies();

const handleGetCategory = async (setListCategory, setLoadingPage) => {
    const body = {
        searchKey: null,
        page: 1,
        limit: 5,
        sortBy: "name",
        sortType: "ASC"
    };
    await AxiosInstance.post(CategoryManagement.getPagination, body, {
        headers: { Authorization: `Bearer ${cookies.get('accessToken')}` }
    }).then((res) => {
        var listCategory = res.data.data.content.map((data) => {
            return {
                id: data.id,
                name: data.name,
                price: data.price
            }
        })
        setListCategory(listCategory)
        setLoadingPage(false)
    })
        .catch((error) => {
            if (error && error.response) {
                console.log("Error: ", error);
            }
        });
};


function ManagementBikeCategory() {
    const [listCategory, setListCategory] = useState([]);
    const [loadingPage, setLoadingPage] = useState(true);
    const tableTitleList = ['ID', 'NAME', 'PRICE']


    useEffect(() => {
        handleGetCategory(setListCategory, setLoadingPage);
    }, [loadingPage])

    return (
        <Fragment>
            <div className='container'>
                <SortBar />
                <TableCRUD tableTitleList={tableTitleList} data={listCategory} />
                {/* <Pagination
                    count={maxPage}
                    shape="rounded"
                    size="large"
                    defaultPage={1}
                    showFirstButton
                    showLastButton
                    page={activePage}
                    onChange={handleChangePage} /> */}
            </div>
        </Fragment>
    )
}
export default ManagementBikeCategory;