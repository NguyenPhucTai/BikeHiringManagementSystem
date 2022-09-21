import React from "react";
import { useField } from "formik";

export const SearchField = ({ ...props }) => {
    const [field] = useField(props);

    return (
        <div className="form-group search-field mb-3" style={{display: 'flex'}}>
            <input
                className={`form-control shadow-none`}
                {...field}
                {...props}
            />
            <button type="submit" className="btn btn-dark btn-md">Search</button>
        </div>
    );
};