import React from "react";
import "./index.sass";
import { withRouter } from "react-router-dom";
import FavoriteBtn from "../FavoriteBtn";

export default withRouter(function ({ history, company, token }) {
    if (!company.id) company.id = company._id;
    delete company._id;

    const { id, name, image, description } = company;

    function goToDetail() {
        const { id } = company;
        history.push(`/detail/${id}`);
    }

    return (
        <a
            className="profile"
            onClick={function (event) {
                event.preventDefault();
                goToDetail();
            }}
        >
            <h3 className="profile-title">{name}</h3>
            <p className="profile-description">{description}</p>

            <FavoriteBtn token={token} companyId={id} />
        </a>
    );
});
