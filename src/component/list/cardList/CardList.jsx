import React from "react";
import { Link } from "gatsby";
import "./card-list.scss";

const CardList = ({ posts }) => {

    return (
        <div className={`card-list wrapper`}>
            {
                posts.map(({ frontmatter }) => (
                    <Link to={`${frontmatter.slug}?list=card`} key={`${frontmatter.slug}-card-link`}>
                        <div className="card wrapper">
                            <img className="card thumbnail" src={frontmatter.thumbnail} alt={frontmatter.title} />
                            <span className="card title">{frontmatter.title}</span>
                        </div>
                    </Link>
                ))
            }
        </div>
    );
};

export default CardList;
