import './index.scss'
import LogoS from '../../assets/images/logo-s.png'
import codechefLogo from '../../assets/images/codechef.png'
import LogoSubtitle from '../../assets/images/Sudip_logo_white.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons'
import {
  faCamera,
  faHome,
  faUser,
  faEnvelope,
  faScrewdriverWrench,
} from '@fortawesome/free-solid-svg-icons'
import { Link, NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <>
      <div className="nav-bar">
        <Link className="logo" to="/">
          {/* <img src={LogoS} alt="Logo" /> 우리 로고 이미지 들어가야함*/}
          {/* <img className="sub-logo" src={LogoSubtitle} alt="slobodan" />:우리 로고 이름 들어가면될듯*/} 
        </Link>
        <nav> 
          <NavLink exact="true" activeclassname="active" to="/">
            <FontAwesomeIcon icon={faHome} color="#4d4d4e" />
          </NavLink>
          {/* 메인 집 */}

          <NavLink
            activeclassname="active"
            className="contact-link"
            to="/contact"
          >
            <FontAwesomeIcon  icon={faUser} color="#4d4d4e" />
          </NavLink>
          {/* 객체 사람 */}

          <NavLink
            activeclassname="active"
            className="skills-link"
            to="/skills">
            <FontAwesomeIcon  icon={faCamera} color="#4d4d4e" />
          </NavLink>
          {/* 카메라 */}

         
            <NavLink activeclassname="active" className="about-link" to="/about">

            {/* <FontAwesomeIcon icon={faScrewdriverWrench} color="#4d4d4e" /> */} 
            <FontAwesomeIcon icon={faEnvelope} color="#4d4d4e"/>
          </NavLink>
          {/* 갤러리 앨범 */}

          
        </nav>
        <ul>
          <li>
            <a
          //     href="https://www.linkedin.com/in/sudip-banerjee-300b691bb/"
          //     target="_blank"
          //     rel="noreferrer"
          //   >
          //     <FontAwesomeIcon icon={faLinkedin} color="#b9b9b9" />
          //   </a>
          // </li>
          // <li>
          //   <a
          //     href="https://github.com/metal-oopa"
          //     target="_blank"
          //     rel="noreferrer"
          //   >
          //     <FontAwesomeIcon icon={faGithub} color="#b9b9b9" />
          //   </a>
          // </li>
          // <li>
          //   <a
          //     href="https://www.codechef.com/users/metal_oopa"
          //     target="_blank"
          //     rel="noreferrer"
            >
              {/* <img src={codechefLogo} width="24" alt="Codechef" /> */}
            </a>
          </li>
        </ul>
      </div>
    </>
  )
}

export default Sidebar
