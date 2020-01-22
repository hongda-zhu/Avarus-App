import React from 'react'
import './index.sass'

export default function ({}) {
    return <footer className="footer">
    <div className="footer__others others">
        <div className="others__copyright">copyright of Adrían Zhu ©2019 </div>
        <ul className="others__social-media social-media">
            <li className="social-media__media-icon">
                <a href="#"><i className="fab fa-twitter-square"></i></a>
            </li>
            <li className="social-media__media-icon">
                <a href="#"><i className="fab fa-facebook-square"></i></a>
            </li>
            <li className="social-media__media-icon">
                <a href="#"><i className="fab fa-instagram"></i></a>
            </li>
            <li className="social-media__media-icon">
                <a href="#"><i className="fab fa-linkedin"></i></a>
            </li>
        </ul>
    </div>
</footer>
}

