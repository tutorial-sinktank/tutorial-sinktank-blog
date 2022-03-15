import React from "react";
import "./blog-title.scss";

const BlogTitle = ({ info }) => {
    return (
        <div className="post-info wrapper">
            <h1 className="title">{info.title}</h1>
            <div className="details">
                <p>date : {info.date}</p>
                <p>category : {info.category}</p>
            </div>
        </div>
    );
};

export default BlogTitle;
