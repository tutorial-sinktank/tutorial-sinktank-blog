import React from "react";
import "./footer.scss";
import BlogConfig from "../../config/blog-config";

const Footer = () => {
    return (
        <footer className="footer wrapper">
            <div className="footer content wrapper">
                <p className="footer blog-name">{BlogConfig.name}</p>
                <p className="footer blog-owner">{BlogConfig.owner}</p>
                {
                    Object.entries(BlogConfig.links).map(([key, value]) => (
                        <p key={`footer-links-${key}`} className="footer related-link">
                            <a href={value} target="_blank">{key}</a>
                        </p>
                    ))
                }
            </div>
            <div className="footer copyright wrapper">
                <p>{BlogConfig.copyright}</p>
            </div>
        </footer>
    );
};

export default Footer;
