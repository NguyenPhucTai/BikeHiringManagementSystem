import React, { Fragment } from "react";
import Table from 'react-bootstrap/Table';

export const TableViewDelete = props => {

    const { setShowPopup, setTitlePopup, tableTitleList, listData, setDataID, setIsDelete } = props;

    return (
        <Fragment>
            <Table responsive>
                <thead>
                    <tr>
                        {tableTitleList.map((element, index) => {
                            return (
                                <th key={index} style={{ width: element.width }}>{element.name}</th>
                            )
                        })}
                        <th key={'buttonColumn'} style={{ width: '20%' }}>ACTION</th>
                    </tr>
                </thead>
                <tbody>
                    {listData.map((element) => {
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
                                    <button className="btn btn-success" type="button" onClick={() => { setShowPopup(true); setTitlePopup("View"); setDataID(element.id); }}>View</button>
                                    <button className="btn btn-danger" type="button" onClick={() => { setShowPopup(true); setTitlePopup("Delete"); setDataID(element.id); setIsDelete(true) }}>Delete</button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        </Fragment>
    );
} 