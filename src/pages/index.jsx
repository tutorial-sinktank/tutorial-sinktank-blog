import React from "react"
import { graphql } from "gatsby";
import "../templates/list.scss";
import ListPage from "../templates/list";

const IndexPage = ({ data, location }) => {
    return <ListPage data={data} location={location} />
};

export const query = graphql`
query ($limit: Int! = 10, $skip: Int! =0, $category: String = "///i") {
        blogs: allMarkdownRemark(sort: { order: DESC, fields: frontmatter___date }, limit: $limit, skip: $skip, filter: {frontmatter: {category: {regex: $category}}}) {
            nodes {
                  id
                  frontmatter {
                        title,
                        category,
                        slug,
                        date(formatString: "YYYY-MM-DD"),
                        thumbnail
                  }
            }
            totalCount
      }
        totalInCategory: allMarkdownRemark(filter: {frontmatter: {category: {regex: $category}}}) {
            totalCount
      }
}
`;

export default IndexPage;
