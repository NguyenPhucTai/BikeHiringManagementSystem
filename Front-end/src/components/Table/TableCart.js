import React, { Fragment } from "react";
import Table from 'react-bootstrap/Table';

export const TableCart = props => {

    const { tableTitleList, listData, setDataID, setIsDelete } = props;

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
                                    <button className="btn btn-danger" type="button" onClick={() => { setDataID(element.id); setIsDelete(true) }}>Delete</button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        </Fragment>
    );
} 