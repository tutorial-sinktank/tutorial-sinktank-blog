import React from "react";
import "./thumbnail.scss";

const Thumbnail = ({ src }) => {
    const url = encodeURI(src);
    return (
        <div className="post-thumbnail wrapper">
            <img src={url} alt="post-thumbnail" height={800} />
        </div>
    );
};

export default Thumbnail;
