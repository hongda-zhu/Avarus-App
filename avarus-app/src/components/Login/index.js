import React, {useState} from 'react'
import './index.sass'
import { withRouter, Link } from 'react-router-dom'
import Feedback from '../Feedback'
import authenticateUser from '../../logic'

export default (function ({ onLogin, error, onClose }) {

    return  <section className="log hidden">
        <div className="container-login">
            <div className="form-login">
        
                <form type="submit" className="wrap-login" onSubmit={function(event) {
                    event.preventDefault()

                    const { username: {value: username}, password: {value: password}} = event.target

                    onLogin(username, password)
                }} >
        
                        <h1 className="wrap-login__title">LOGIN</h1>
        
                        <div className="wrap-login__input" data-validate="username is required">
                            <input className="wrap-login__input-container" type="username" name="username" placeholder="Username" />
                            <span className="wrap-login__input-symbol">
                                <i className="far fa-envelope"></i>
                            </span>
                        </div>
        
                        <div className="wrap-login__input" data-validate="password is required">
                            <input className="wrap-login__input-container" type="password" name="password" placeholder="Password" />
                            <span className="wrap-login__input-symbol">
                                <i className="fas fa-unlock-alt"></i>
                            </span>
                        </div>

                        <div className="form-login__btnContainer btnContainer">
                            <input className="btnContainer__btn" type="submit" value ="Login"></input>
                        </div>
                </form>
        
                        <div className="form-login__textContainer">
                            <Link className="form-login__textContainer-a" to ="/">
                                Go back
                            </Link>
        
                            <Link className="form-login__textContainer-a" to="/register">
                                Sign up now							
                            </Link> 
                        </div>
                        <p className="form-login__copyright">@copyright by Adrían Zhu</p>     
                </div>
                {error && < Feedback message={error} onClose={onClose}/>}
        </div>
    </section>

})