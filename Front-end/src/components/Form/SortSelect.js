import React from "react";
import Select from "react-select";

export const SortSelect = ({ ...props }) => {
    return (
        <div className="form-group mb-3">
            <Select
                className={`shadow-none`}
                {...props}
            />
        </div>
    );
}