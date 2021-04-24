/** @jsx jsx */
import { jsx } from 'theme-ui'
import React from 'react'
import { Link , graphql } from "gatsby"
import { RiArrowRightLine, RiArrowLeftLine } from "react-icons/ri"

import Layout from "../components/layout"
import PackageCard from "../components/package-card"
import SEO from "../components/seo"

const styles = {
  pagination: {
    'a': {
      color: 'muted',
      '&.is-active': {
        color: 'text'
      },
      '&:hover': {
        color: 'text'
      }
    }
  }
}

export const packageListQuery = graphql`
  query packageListQuery($skip: Int!, $limit: Int!) {
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      filter: { frontmatter: { template: { eq: "blog-package" } } }
      limit: $limit
      skip: $skip
		) {
      edges {
        node {
          id
          excerpt(pruneLength: 250)
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            slug
						title
						featuredImage {
							childImageSharp {
								fluid(maxWidth: 540, maxHeight: 360, quality: 80) {
                  ...GatsbyImageSharpFluid
                  ...GatsbyImageSharpFluidLimitPresentationSize
                }
							}
						}
          }
        }
      }
    }
  }
`
const Pagination = (props) => (
  <div 
    className="pagination"
    sx={styles.pagination}
  >
    <ul>
      {!props.isFirst && (
        <li>
          <Link to={props.prevPage} rel="prev">
          <span className="icon -left"><RiArrowLeftLine/></span> Previous
          </Link>
        </li>
      )}
      {Array.from({ length: props.numPages }, (_, i) => (
        <li key={`pagination-number${i + 1}`} >
          <Link
            to={`${props.blogSlug}${i === 0 ? '' : i + 1}`}
            className={props.currentPage === i + 1 ? "is-active num" : "num"}
          >
            {i + 1}
          </Link>
        </li>
      ))}
      {!props.isLast && (
        <li>
          <Link to={props.nextPage} rel="next">
            Next <span className="icon -right"><RiArrowRightLine/></span>
          </Link>
        </li>
      )}
    </ul>
  </div>
)
class PackageIndex extends React.Component {
  render() {
    
    const { data } = this.props
    const { currentPage, numPages } = this.props.pageContext
    const blogSlug = '/package/' 
    const isFirst = currentPage === 1
    const isLast = currentPage === numPages
    const prevPage = currentPage - 1 === 1 ? blogSlug : blogSlug + (currentPage - 1).toString()
    const nextPage = blogSlug + (currentPage + 1).toString()

    const packages = data.allMarkdownRemark.edges
      .filter(edge => !!edge.node.frontmatter.date)
      .map(edge =>
        <PackageCard key={edge.node.id} data={edge.node} />
      )
    let props = {
      isFirst,
      prevPage,
      numPages,
      blogSlug,
      currentPage,
      isLast,
      nextPage
    }
    
    return (
      <Layout className="blog-page">
        <SEO
          title={"Package — Page " + currentPage + " of " + numPages}
          description={"Stackrole base Package page " + currentPage + " of " + numPages }
        />
        <h1>Package</h1>
        <div className="grids col-1 sm-2 lg-3">
          {packages}
        </div>
        <Pagination {...props} />
      </Layout>
    )
  }
}

export default PackageIndex