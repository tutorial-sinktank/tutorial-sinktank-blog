import React, { useEffect } from "react";
import "./layout.scss";
import "./index.css";
import { Link, graphql, useStaticQuery } from "gatsby";
import SideNavbar from "../component/SideNavbar/SideNavbar";
import Footer from "../component/footer/Footer";

const Layout = ({ children, location }) => {

    const data = useStaticQuery(graphql`
{
    blogs: allMarkdownRemark {
        nodes {
          frontmatter {
            category
            slug
          }
        }
    }
}`);
    const params = new URLSearchParams(location.search);
    const listStyle = params.get("list") ?? "log";

    useEffect(() => {
        // google analytics page visit event log trigger
        // typeof window !== "undefined" && window.gtag("event", location.pathname, {});
    }, [location]);

    return (
        <div className="layout outer wrapper">
            <SideNavbar blogs={data?.blogs ?? null} location={location} />
            <header className="header">
                <div className="inner wrapper">
                    <h1 className="blog-title">
                        <Link to={`/?list=${listStyle}`}>Tutorial SinkTank</Link>
                    </h1>
                </div>
            </header>
            <main>
                <div className="content">
                    <h3 className="blog-title">
                        <Link to={`/?list=${listStyle}`}>Tutorial SinkTank</Link>
                    </h3>
                    {children}
                </div>
            </main>
            <Footer />
        </div>
    );
};


export default Layout;
