import React, { Fragment, useState } from "react";
import { Popup } from "../components/Modal/Popup";

function TestPopupPage() {

    const [showPopup, setShowPopup] = useState(false);

    return (
        <Fragment>
            <div className="container">
                <button className="btn btn-primary" onClick={() => setShowPopup(true)}>Show Poppup</button>
                <Popup showPopup={showPopup} setShowPopup={setShowPopup} title={"Create"} />
            </div>
        </Fragment>
    )
}

export default TestPopupPage;