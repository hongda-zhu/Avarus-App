import React from 'react'
import './main.scss'
import { Link } from 'react-router-dom';
import {  withRouter } from 'react-router-dom'
const API_URL = process.env.REACT_APP_API_URL

export default withRouter(function ({ name, budget, onLogout, picture, userId}) {
    
    // const header = document.querySelector('.main-header');

    // window.addEventListener('scroll', () => {
    //     const scrollPos = window.scrollY;
    //     if (scrollPos > 10) {
    //         header.classList.add('scrolled');
    //     } else {
    //         header.classList.remove('scrolled');
    //     }
    // })

    // picture && (picture = `${API_URL}/users/load/${userId}?timestamp=${Date.now()}`)

    return   <header className="main-header">
    <div className="logo">
        <a >Avarus</a>
    </div>

    <input type="checkbox" className="menu-btn" id="menu-btn" />
    <label for="menu-btn" className="menu-icon" >
        <span className="menu-icon__line"></span>
    </label>

    <ul className="nav-links">
        <li className="nav-link">
            <label><Link to="/main">Hi! {name}</Link></label>
        </li>
        <li className="nav-link">
            <label>your buying power is {budget}</label>
        </li>
        <li className="nav-link">
            <label><img className="user-container_image" src={picture ? picture : "images/default/default-user.png"}/></label>
        </li>
        <li className="nav-link">
            <label><Link to="/main">Main</Link></label>
        </li>
        <li className="nav-link">
            <label><Link to="/transactions">Transactions</Link></label>
        </li>
        <li className="nav-link">
            <label><Link to="/favorites">Favorite</Link></label>
        </li>
        <li className="nav-link">
            <label><Link to="/userpage">Profile</Link></label>
        </li>
        <li className="nav-link">
            <a onClick = {event => {
                event.preventDefault()
                onLogout()
            }}>Logout</a>
        </li>
    </ul>
</header>

})


// import React from 'react'
// import './index.sass'
// import { Link } from 'react-router-dom';
// import {  withRouter } from 'react-router-dom'

// export default withRouter(function ({ name, budget, onLogout, picture}) {
//     return <header className="header">
//         <input id="show-menu" name="modal" type="checkbox" />

//         <label className="header-hamburger hamburger" htmlFor="show-menu"><span className="hamburger__icon"></span></label>

//         <p className="logo">Avarus</p>

//         <button className="button" onClick = {event => {
//             event.preventDefault()
//             onLogout()
//         }}>Logout</button>

//         <nav className="header-nav nav">
//             <ul className="nav-menu menu">
//                 <li className="menu-item">Hi! {name}</li>
//                 <li className="menu-item"><div className="user-container"><img className="user-container_image" src={picture ? picture : "images/default/default-user.png"}/></div></li>
//                 <li className="menu-item">your buying power is {budget}</li>
//                 <li className="menu-item"><Link to="/main">Main</Link></li>
//                 <li className="menu-item"><Link to="/transactions">Transactions</Link></li>
//                 <li className="menu-item"><Link to="/favorites">Favorite</Link></li>
//                 <li className="menu-item"><Link to="/userpage">Profile</Link></li> 
//                 <li className="menu-item">
//                     <label className="hamburger-close" htmlFor="show-menu">Close</label>
//                 </li>
//             </ul>
//         </nav> 

//      </header>  
// })
