import React, { Fragment } from "react";
import Table from 'react-bootstrap/Table';

export const TableView = props => {

    const { tableTitleList, listData, setDataID } = props;

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
                                    <button className="btn btn-success" onClick={() => { setDataID(element.id); }}>View Details</button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        </Fragment>
    );
} 