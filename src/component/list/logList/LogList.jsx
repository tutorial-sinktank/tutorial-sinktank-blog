import React from "react";
import { Link } from "gatsby";
import "./log-list.scss";

const LogList = ({ posts }) => {
    return (
        <div className={`log-list outer wrapper`}>
            <ul className="log-list inner wrapper">
                {
                    posts.map(({ frontmatter }, idx) => {
                        return <li key={`${frontmatter.slug}-log-link`} className="log line" idx={idx + 1}>
                            <Link to={`${frontmatter.slug}?list=log`}>{frontmatter.title} - {frontmatter.date}</Link>
                        </li>
                    })
                }
            </ul>
        </div>
    );
};

export default LogList;
