import React from "react";
import { Modal, Typography } from '@mui/material';
// import { TextField } from "../Form/TextField";
// import { Formik, Form } from "formik";

export const Popup = (props) => {
    const { showPopup, setShowPopup, child, title } = props;
    return (
        <Modal
            open={showPopup}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <div className="container">
                <div className="popup-container">
                    <h2 className="popup-title">{title}</h2>
                    <div className="popup-content">
                        {child}
                    </div>
                    <div className="popup-button">
                        <button className="btn btn-primary btn-action">{title}</button>
                        <button className="btn btn-secondary btn-cancel" onClick={() => { setShowPopup(false) }}>Cancel</button>
                    </div>
                </div>
            </div>
        </Modal>
    )
}