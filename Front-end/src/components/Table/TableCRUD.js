import React, { Fragment } from "react";
import Table from 'react-bootstrap/Table';

export const TableCRUD = props => {

    const { setShowPopup, setTitlePopup, tableTitleList, data } = props;

    return (
        <Fragment>
            <Table responsive>
                <thead>
                    <tr>
                        {tableTitleList.map((element, index) => {
                            return (
                                <th key={index}>{element}</th>
                            )
                        })}
                        <th key={'buttonColumn'}>ACTION</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((element) => {
                        return (
                            <tr key={element.id}>
                                {
                                    Object.keys(element).map(function (propertyName, index) {
                                        return (
                                            <td key={index}>{element[propertyName]}</td>
                                        )
                                    })
                                }
                                <td key={'buttonRow'}>
                                    <button className="btn btn-success" onClick={() => { setShowPopup(true); setTitlePopup("View") }}>View</button>
                                    <button className="btn btn-primary">Update</button>
                                    <button className="btn btn-danger">Delete</button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        </Fragment>
    );
} 