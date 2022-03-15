import React, { useState, useCallback, useMemo } from "react";
import { Link } from "gatsby";
import './side-navbar.scss';
import folderIcon from "../../images/folder-icon.svg";

const SideNavbar = ({ blogs, location }) => {
    const [showFolder, setShowFolder] = useState(false);
    const params = new URLSearchParams(location.search);
    const listStyle = params.get("list") ?? "log";

    const dirPaths = useMemo(() => {
        if (blogs === null | blogs === undefined) {
            return [];
        }
        const { nodes } = blogs;
        let result = [];
        nodes.forEach(post => {
            const path = post.frontmatter.category;
            if (!result.includes(path)) {
                for (let i = 1; i < path.length; i++) {
                    if (path[i] === "/") {
                        if (!result.includes(path.slice(0, i))) {
                            result.push(path.slice(0, i));
                        }
                    }
                }
                result.push(path);
            }
        });
        return result.sort();
    }, [blogs]);

    const onToggle = useCallback(() => {
        setShowFolder(prev => !prev);
    }, [setShowFolder]);

    return (
        <>
            <div className={`block-screen ${showFolder ? "" : "unblock"}`} onClick={onToggle}></div>
            <div className="topnav wrapper">
                <div>
                    <button className="icon-button" onClick={onToggle}>
                        <img
                            className="icon menu-folder"
                            src={folderIcon}
                            alt="menu"
                            width={35}
                        />
                    </button>
                </div>
            </div>

            <aside className={`side-navbar ${showFolder ? "show" : "hide"}`}>
                <nav>
                    <Link to={`/?list=${listStyle}`} onClick={onToggle}>
                        <h1>/Home</h1>
                    </Link>
                    <ul>
                        {
                            dirPaths.map((path) => {
                                let list = path.split("/");
                                let displayName = list.reduce((acc, curr, idx) => {
                                    if (idx === 0) {
                                        return acc + "|--"
                                    } else if (idx === list.length - 1) {
                                        return acc + `${curr}`;
                                    } else {
                                        return acc + "--"
                                    }
                                }, "");
                                if (displayName.trim() === "|--") {
                                    displayName = "|--all-posts"
                                }
                                return (<li key={`side-nav-link-${path}`}>
                                    <Link to={`/list/1${path}?list=${listStyle}`} onClick={onToggle}>{displayName}</Link>
                                </li>
                                )
                            })
                        }
                    </ul>
                </nav>
            </aside>
        </>
    );
};

export default SideNavbar;
