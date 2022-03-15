import React, { useCallback, useEffect, useMemo, useState } from "react"
import { Helmet } from "react-helmet";
import { graphql, navigate } from "gatsby";
import "./list.scss";
import CardList from "../component/list/cardList/CardList";
import LogList from "../component/list/logList/LogList";
import Pagination from "../component/pagination/Pagination/Pagination";
import cardList from "../images/card-list.svg";
import cardListSelected from "../images/card-list-selected.svg";
import logList from "../images/log-list.svg";
import logListSelected from "../images/log-list-selected.svg";
import { LIST_LIMIT } from "../config/query-config";

const ListPage = ({ data, location }) => {
    const { blogs } = data;
    const params = new URLSearchParams(location.search);
    const [listStyle, setListStyle] = useState(null);
    let paths = location.pathname.slice(1).split("/");
    paths.shift();
    let pageNum = paths.shift();
    try {
        pageNum = parseInt(pageNum);
    } catch {
        pageNum = 1;
    }
    const dir = `/${paths.join("/")}`;

    const onChangeListStyle = useCallback((styleName) => () => {
        params.set("list", styleName)
        navigate(`${location.pathname}?${params.toString()}`)
        setListStyle(params.get("list"))
    }, [location]);


    const posts = useMemo(() => {
        return blogs.nodes.map((post) => post);
    }, [blogs, dir]);

    const generateListContent = useCallback((listStyle) => {
        if (listStyle === null) {
            return <></>;
        }
        return (
            <>
                <Helmet>
                    <title>Tutorial SinkTank</title>
                    <meta name="description" content="list of contents" />
                    <meta name="keywords" content="Tutorial SinkTank" />
                </Helmet>
                <div className="list-button wrapper">
                    <button className="list-button" onClick={onChangeListStyle("log")}>
                        <img src={logList} alt="view in log mode" className={`list-button image log ${listStyle === "log" ? "hide" : "show"}`} />
                        <img src={logListSelected} alt="view in log mode" className={`list-button image log ${listStyle === "log" ? "show" : "hide"}`} />
                    </button>
                    <button className="list-button" onClick={onChangeListStyle("card")}>
                        <img src={cardList} alt="view in card mode" className={`list-button image card ${listStyle === "card" ? "hide" : "show"}`} />
                        <img src={cardListSelected} alt="view in card mode" className={`list-button image card ${listStyle === "card" ? "show" : "hide"}`} />
                    </button>
                </div>
                {
                    listStyle === "card" ? <CardList posts={posts} listStyle={listStyle} /> : <LogList posts={posts} listStyle={listStyle} />
                }
            </>
        );
    }, [listStyle]);


    useEffect(() => {
        setListStyle(new URLSearchParams(location.search).get("list") ?? "log");
    }, [location]);

    return (
        <>
            <div>
                {
                    generateListContent(listStyle)
                }
            </div>
            <Pagination currentPage={pageNum} category={dir} totalPage={Math.ceil(data.totalInCategory.totalCount / LIST_LIMIT)} queryParams={params} />
        </>
    );
};

export const query = graphql`
    query ($skip: Int! = 0, $limit: Int! = 2, $category: String = "///i") {
        blogs: allMarkdownRemark(limit: $limit, skip: $skip, filter: {frontmatter: {category: {regex: $category}}}) {
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

export default ListPage;
