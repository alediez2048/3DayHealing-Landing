const path = require("path")
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions

  //const blogPost = path.resolve(`./src/templates/blog-post.js`)
  const blogList = path.resolve(`./src/templates/blog-list.js`)
  const packageList = path.resolve(`./src/templates/package-list.js`)

  const result = await graphql(`
    {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        filter: { frontmatter: { template: {nin: ["blog-post", "blog-package"]} } }
      ) {
        edges {
          node {
            id
            frontmatter {
              slug
              template
              title
            }
          }
        }
      }
    }
  `)
  const resultpackage = await graphql(`
    {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        filter: { frontmatter: { template: { eq: "blog-package" } } }
      ) {
        edges {
          node {
            id
            frontmatter {
              slug
              template
              title
            }
          }
        }
      }
    }
  `)
  const resultpost = await graphql(`
    {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        filter: { frontmatter: { template: { eq: "blog-post" } } }
      ) {
        edges {
          node {
            id
            frontmatter {
              slug
              template
              title
            }
          }
        }
      }
    }
  `)

  // Handle errors
  if (resultpost.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }
  // Handle errors
  if (resultpackage.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }
  // Handle errors
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }

  // Create markdown pages
  const posts = resultpost.data.allMarkdownRemark.edges
  let blogPostsCount = 0

  posts.forEach((post, index) => {
    const id = post.node.id
    const previous = index === posts.length - 1 ? null : posts[index + 1].node
    const next = index === 0 ? null : posts[index - 1].node
    const prefix = `/blog/`

    createPage({
      path: prefix + post.node.frontmatter.slug,
      component: path.resolve(
        `src/templates/${String(post.node.frontmatter.template)}.js`
      ),
      // additional data can be passed via context
      context: {
        id,
        previous,
        next,
      },
    })

    // Count blog posts.
    if (post.node.frontmatter.template === 'blog-post') {
      blogPostsCount++
    }
  })

  // Create markdown pages
  const pages = result.data.allMarkdownRemark.edges
  let blogpagesCount = 0

  pages.forEach((page, index) => {
    const id = page.node.id
    const previous = index === pages.length - 1 ? null : pages[index + 1].node
    const next = index === 0 ? null : pages[index - 1].node

    createPage({
      path: page.node.frontmatter.slug,
      component: path.resolve(
        `src/templates/${String(page.node.frontmatter.template)}.js`
      ),
      // additional data can be passed via context
      context: {
        id,
        previous,
        next,
      },
    })

    // Count blog pages.
    if (page.node.frontmatter.template != 'blog-post' || page.node.frontmatter.template != 'blog-package') {
      blogpagesCount++
    }
  })

  // Create markdown pages
  const packages = resultpackage.data.allMarkdownRemark.edges
  let blogPackagesCount = 0

  packages.forEach((post, index) => {
    const id = post.node.id
    const previous = index === packages.length - 1 ? null : packages[index + 1].node
    const next = index === 0 ? null : packages[index - 1].node
    const prefix = `/package/`

    createPage({
      path: prefix + post.node.frontmatter.slug,
      component: path.resolve(
        `src/templates/${String(post.node.frontmatter.template)}.js`
      ),
      // additional data can be passed via context
      context: {
        id,
        previous,
        next,
      },
    })

    // Count blog packages.
    if (post.node.frontmatter.template === 'blog-package') {
      blogPackagesCount++
    }
  })

  // Create blog-list pages
  const postsPerPage = 9
  const numPagesposts = Math.ceil(blogPostsCount / postsPerPage)

  Array.from({ length: numPagesposts }).forEach((_, i) => {
    createPage({
      path: i === 0 ? `/blog` : `/blog/${i + 1}`,
      component: blogList,
      context: {
        limit: postsPerPage,
        skip: i * postsPerPage,
        numPagesposts,
        currentPage: i + 1,
      },
    })
  })

  // Create blog-list pages
  const packagePerPage = 9
  const numPagespackage = Math.ceil(blogPostsCount / packagePerPage)

  Array.from({ length: numPagespackage }).forEach((_, i) => {
    createPage({
      path: i === 0 ? `/package` : `/package/${i + 1}`,
      component: packageList,
      context: {
        limit: packagePerPage,
        skip: i * packagePerPage,
        numPagespackage,
        currentPage: i + 1,
      },
    })
  })

   // Create blog-list pages
   const pagesPerPage = 9
   const numPagespages = Math.ceil(blogpagesCount / pagesPerPage)
 
   Array.from({ length: numPagespages }).forEach((_, i) => {
     createPage({
       path: i === 0 ? `/blog` : `/blog/${i + 1}`,
       component: blogList,
       context: {
         limit: pagesPerPage,
         skip: i * pagesPerPage,
         numPagespages,
         currentPage: i + 1,
       },
     })
   })

}

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, basePath: `pages` })
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    })
  }
}