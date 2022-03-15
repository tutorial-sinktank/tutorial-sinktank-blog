module.exports = {
    siteMetadata: {
        title: `Tutorial SinkTank`,
        siteUrl: `https://tutorial-sinktank.com`,
    },
    plugins: [
        // {
        //     resolve: `gatsby-plugin-google-gtag`,
        //     output: '/sitemap',
        //     options: {
        //         // You can add multiple tracking ids and a pageview event will be fired for all of them.
        //         trackingIds: [
        //             "G-KJVF1VBLK8",
        //         ],
        //         // This object gets passed directly to the gtag config command
        //         // This config will be shared across all trackingIds
        //         //                gtagConfig: {
        //         //                    optimize_id: "OPT_CONTAINER_ID",
        //         //                    anonymize_ip: true,
        //         //                    cookie_expires: 0,
        //         //                },
        //         // This object is used for configuration specific to this plugin
        //         pluginConfig: {
        //             // Puts tracking script in the head instead of the body
        //             head: false,
        //             // Setting this parameter is also optional
        //             respectDNT: true,
        //             // Avoids sending pageview hits from custom paths
        //             exclude: [],
        //         },
        //     },
        // },
        "gatsby-plugin-react-helmet",
        {
            resolve: `gatsby-plugin-sitemap`,
            options: {
                query: `{
                site {
                    siteMetadata {
                        siteUrl
                    }
                }
          allSitePage {
            nodes {
              path
            }
          }
        }`,
                resolveSiteUrl: (data) => data.site.siteMetadata.siteUrl,
                resolvePages: (data) => data.allSitePage.nodes,
                serialize: (page) => {
                    return {
                        url: page.path,
                        changefreq: `daily`,
                        priority: 0.7,
                    }
                },
                createLinkInHead: true,
            },
        },
        {
            resolve: 'gatsby-plugin-robots-txt',
            options: {
                host: 'https://tutorial-sinktank.com',
                sitemap: 'https://tutorial-sinktank.com/sitemap/sitemap-index.xml',
                policy: [{userAgent: '*', allow: '/'}]
            }
        },
        {
            resolve: `gatsby-plugin-layout`,
            options: {
                component: require.resolve(`./src/layout/Layout.jsx`),
            },
        },
        {
            resolve: "gatsby-plugin-sass",
            options: {
                postCssPlugins: [
                    require("tailwindcss"),
                    require("./tailwind.config.js"), // Optional: Load custom Tailwind CSS configuration
                ],
            },
        },
        {
            resolve: 'gatsby-plugin-manifest',
            options: {
                "icon": "src/images/icon.png"
            }
        }, "gatsby-plugin-mdx", "gatsby-plugin-sharp", "gatsby-transformer-sharp", {
            resolve: 'gatsby-source-filesystem',
            options: {
                "name": "images",
                "path": "./src/images/"
            },
            __key: "images"
        }, {
            resolve: 'gatsby-source-filesystem',
            options: {
                "name": "pages",
                "path": "./src/pages/"
            },
            __key: "pages"
        },
        {
            resolve: 'gatsby-source-filesystem',
            options: {
                "name": "posts",
                "path": `${__dirname}/posts`
            },
        },
        {
            resolve: "gatsby-plugin-page-creator",
            options: {
                path: `${__dirname}/posts`,
            },
        },
        `gatsby-plugin-mdx`,
        'gatsby-plugin-image',
        'gatsby-plugin-sharp',
        'gatsby-transformer-sharp',
        {
            resolve: `gatsby-transformer-remark`,
            options: {
                plugins: [
                    {
                        resolve: `gatsby-remark-images`,
                        options: {
                            maxWidth: 590,
                        },
                    },
                ],
            },
        }
    ]
};
