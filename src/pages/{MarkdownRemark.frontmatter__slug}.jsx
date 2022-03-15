import React from "react";
import { Helmet } from "react-helmet";
import { graphql } from "gatsby";
import BlogTitle from "../component/post/blogTitle/BlogTitle";
import BlogContent from "../component/post/blogContent/BlogContent";
import Thumbnail from "../component/post/thumbnail/Thumbnail";
import "./post.scss";
import Comment from "../component/Comment/Comment";

const Template = ({ data }) => {
    const { markdownRemark: { frontmatter, html } } = data;
    return (
        <div className="post wrapper">
            <Helmet>
                <title>{frontmatter.title}</title>
                <meta name="description" content={frontmatter.title} />
                <meta name="keywords" content={`Tutorial SinkTank${frontmatter.category.split("/").join(",")},${frontmatter.tags}`} />
            </Helmet>
            <BlogTitle info={frontmatter} />
            <Thumbnail src={frontmatter.thumbnail} />
            <BlogContent htmlContent={html} />
            <Comment />
        </div>
    );
};

export const pageQuery = graphql`
  query ($id: String!) {
    blogs: allMarkdownRemark {
          nodes {
              frontmatter {
                  title
                  date
                  category
                  slug
                  thumbnail
                  tags
              }
          }
      }
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        date(formatString: "YYYY-MM-DD")
        slug
        category
        title
        thumbnail
        tags
        }
      }
  }
`;

//export const navQuery = graphql`
//  {
//          blogs: allMarkdownRemark {
//        nodes {
//          frontmatter {
//            slug
//          }
//        }
//      }
//  }
//`;

export default Template;
