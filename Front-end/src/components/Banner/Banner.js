import React from "react";

export const Banner = () => {

    return (
        <div className="banner"
            style={{
                background: "url(https://firebasestorage.googleapis.com/v0/b/bike-hiring-management-d7a01.appspot.com/o/bike-image%2Fbanner-sonic.jpg?alt=media&token=1ad73bbc-abb4-4299-a0c2-170d817d258e)",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center"
            }}
        >
            <div className="banner__info">
                <div className="banner__detail">
                    <h2>Do you want to hire a motorcycle?</h2>
                    <p>Learn about us now to find the right vehicle for you.</p>
                </div>
            </div>
        </div>
    )
}