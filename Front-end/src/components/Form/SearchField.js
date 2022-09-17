import React from "react";
import { useField } from "formik";

export const SearchField = ({ ...props }) => {
    const [field] = useField(props);

    return (
        <div className="form-group mb-3">
            <input
                className={`form-control shadow-none`}
                {...field}
                {...props}
            />
            <button type="submit" className="btn btn-dark btn-md mt-3">Search</button>
        </div>
    );
};