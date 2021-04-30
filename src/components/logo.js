/** @jsx jsx */
import { jsx } from 'theme-ui'
import { Link } from "gatsby"

const Logo = (props) => (
  <div sx={styles.siteLogo}>
    <Link to="/">
      <img src={props.image} alt={props.title} />
    </Link>
    <Link to="/">{props.title}</Link>
  </div>
)

export default Logo

const styles = {
  siteLogo: {
    display: "flex",
    justifyContent: ["center", "center", "left"],
    alignItems: "center",
    fontSize: 3,
    textAlign: ["center", "center", "left"],
    a: {
      color: "blank",
      textDecoration: "none",
      "&:hover": {
        color: "blank",
      },
    },
    img: {
      maxHeight: "100px",
      mr: 2,
    },
  },
}
