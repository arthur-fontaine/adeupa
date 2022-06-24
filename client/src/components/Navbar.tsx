import home from '../images/home.svg'
import search from '../images/search.svg'
import calendar from '../images/calendar.svg'
import profile from '../images/profile.svg'

const Navbar = () => {
  return (
    <div className="navbar__navbar-rectangle">
      <section className="navbar__navbar-rectangle__section">
        <div className="navbar__navbar-rectangle__section--icon-wrap">
          <img src={home} alt="home button" />
        </div>
        <div className="navbar__navbar-rectangle__section--icon-separate"></div>
        <div className="navbar__navbar-rectangle__section--icon-wrap">
          <img src={search} alt="search button" />
        </div>
      </section>
      <section className="navbar__navbar-rectangle__section">
        <div className="navbar__navbar-rectangle__section--icon-wrap">
          <img src={calendar} alt="calendar button" />
        </div>
        <div className="navbar__navbar-rectangle__section--icon-separate"></div>
        <div className="navbar__navbar-rectangle__section--icon-wrap">
          <img src={profile} alt="profile button" />
        </div>
      </section>
    </div>
  )
}

export default Navbar
