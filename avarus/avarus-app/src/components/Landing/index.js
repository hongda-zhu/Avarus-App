import React from 'react'
import './index.sass'
import { withRouter } from 'react-router-dom'

export default withRouter (function ({ history }) {

    function handleGoToRegister (){ history.push('/register') }
    function handleGoToLogin (){ history.push('/login') }

    return  <section className="land">
                <div className="container-landing">
                    <div className="form-landing">

                        <div className="wrap-landing">

                                <h1 className="wrap-landing__title">Avarus</h1>
                        
                                <div className="wrap-landing__btnContainer btnContainer">
                                    <button className="btnContainer__btn" onClick={
                                        event => {event.preventDefault(); handleGoToLogin()}
                                    }>Login</button>
                                    <button className="btnContainer__btn" onClick={
                                        event => {event.preventDefault(); handleGoToRegister()}
                                    }>Register</button>
                                </div>

                                <p className="wrap-landing__copyright">@copyright by Adrían Zhu</p>
                        </div> 
                    </div>
                </div>
            </section>
})