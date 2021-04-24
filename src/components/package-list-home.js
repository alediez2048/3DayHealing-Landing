/** @jsx jsx */
import { jsx } from 'theme-ui'
import { Link, StaticQuery, graphql } from "gatsby"
import { RiArrowDownLine, RiArrowRightSLine } from "react-icons/ri"

import PostCard from "./post-card"

const PostMaker = ({ data }) => (
  <section className="home-packages">
    <h2><strong>Packages</strong> <span class="icon -right"><RiArrowDownLine/></span></h2>
    <div className="grids col-1 sm-2 lg-3">
      {data}
    </div>
    <Link 
      className="button" 
      to="/package"
      sx={{
        variant: 'links.button'
      }}
    >
      See more<span class="icon -right"><RiArrowRightSLine/></span>
    </Link>
  </section>
)

export default function PackageListHome() {
  return (
    <StaticQuery 
      query={graphql`
        query {
          allMarkdownRemark(
            sort: { order: DESC, fields: [frontmatter___date] }
            filter: { frontmatter: { template: { eq: "blog-package" } } }
            limit: 6
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
        }`
      }

      render={ data => {
          const packages = data.allMarkdownRemark.edges
            .filter(edge => !!edge.node.frontmatter.date)
            .map(edge =>
              <PostCard key={edge.node.id} data={edge.node} />
          )
          return <PostMaker data={packages} />
        } 
      }
    />
  )
}