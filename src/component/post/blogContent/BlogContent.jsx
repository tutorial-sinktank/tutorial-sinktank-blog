import React from "react";
import "./blog-content.scss";
import "./custom-markdown.scss";

const BlogContent = ({ htmlContent }) => {
    return (
        <div id="markdown-body" className="post-content" dangerouslySetInnerHTML={{ __html: htmlContent }}></div>
    );
};

export default BlogContent;
