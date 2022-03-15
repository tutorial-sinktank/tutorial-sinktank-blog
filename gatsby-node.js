const path = require(`path`)
const config = require("./src/config/query-config");
// Log out information after a build is done
exports.onPostBuild = ({ reporter }) => {
    reporter.info(`Your Gatsby site has been built!`)
}
// Create blog pages dynamically
exports.createPages = async ({ graphql, actions }) => {
    const { createPage } = actions;
    let paths = [];
    const allPosts = await graphql(`
{
    blogs: allMarkdownRemark {
    group(field: frontmatter___category) {
      fieldValue
      nodes {
        frontmatter {
          title
        }
      }
    }
    totalCount
  }
}
  `);

    console.log(allPosts)
    const postsPerPage = config.LIST_LIMIT;
    console.log(Math.ceil(allPosts.data.blogs.totalCount / postsPerPage))
    createPage({
        path: `/`,
        component: path.resolve("./src/pages/index.jsx"),
        context: {
            limit: postsPerPage,
            skip: 0,
            totalPage: Math.ceil(allPosts.data.blogs.totalCount / postsPerPage),
            currentPage: 1,
            category: "///i"
        },
    })
    Array.from({ length: Math.ceil(allPosts.data.blogs.totalCount / postsPerPage) }).forEach((_, i) => {
        console.log(`/list/${i + 1}`)
        createPage({
            path: `/list/${i + 1}`,
            component: path.resolve("./src/templates/list.jsx"),
            context: {
                limit: postsPerPage,
                skip: i * postsPerPage,
                totalPage: Math.ceil(allPosts.data.blogs.totalCount / postsPerPage),
                currentPage: i + 1,
                category: "///i"
            },
        })
    })
    allPosts.data.blogs.group.forEach(({ fieldValue, nodes }) => {
        for (let i = 0; i < nodes.length; i++) {
            createPage({
                path: `/list/${i + 1}${fieldValue === "/" ? "" : fieldValue}`,
                component: path.resolve("./src/templates/list.jsx"),
                context: {
                    limit: postsPerPage,
                    skip: i * postsPerPage,
                    totalPage: Math.ceil(nodes.length / postsPerPage),
                    currentPage: i + 1,
                    category: `/${fieldValue}/i`,
                },
            })
        }

        for (let j = 1; j < fieldValue.length; j++) {
            if (fieldValue[j] === "/") {
                console.log(fieldValue.slice(0, j))
                if (!paths.includes(fieldValue.slice(0, j))) {
                    paths.push(fieldValue.slice(0, j));
                }
            }
        }
        console.log(paths)
    })
    const sortByCategory = {};
    for (let i = 0; i < paths.length; i++) {
        const parentPath = paths[i];

        console.log(`/${parentPath.replaceAll("/", "\\/")}/`)
        sortByCategory[parentPath] = await graphql(`
            {
                blogs: allMarkdownRemark(filter: {frontmatter: {category: {regex: "/${parentPath.replaceAll("/", "\\/")}/"}}}) {
                  nodes {
                    frontmatter {
                      title
                    }
                  }
                  totalCount
                }
            }
              `);
        for (let idx = 0; idx < Math.ceil(sortByCategory[parentPath].data.blogs.totalCount / postsPerPage); idx++) {
            console.log("start")
            console.log(`/list/${idx + 1}${parentPath}`)
            createPage({
                path: `/list/${idx + 1}${parentPath}`,
                component: path.resolve("./src/templates/list.jsx"),
                context: {
                    limit: postsPerPage,
                    skip: idx * postsPerPage,
                    totalPage: Math.ceil(sortByCategory[parentPath].data.blogs.totalCount / postsPerPage),
                    currentPage: idx + 1,
                    category: `/${parentPath}/i`,
                },
            })
        }
    }
}
