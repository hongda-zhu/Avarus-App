import React, {useState} from 'react'
import './index.sass'
import { withRouter, Link } from 'react-router-dom'
import Feedback from '../Feedback'
import registerUser from '../../logic'

export default withRouter (function ({ error, onRegister, onClose }) {

    return  <section className="reg">
    <div className="container-register">
        <div className="form-register">

        <h1 className="form-register__title">Register</h1>

            <form type="submit" className="wrap-register" onSubmit = {event => {

                    event.preventDefault()

                    const {  
                        email: { value: email }, 
                        username: { value: username }, 
                        password: { value: password },
                        verifiedPassword: { value: verifiedPassword } } = event.target

                    onRegister( email, username, password, verifiedPassword)

            }} >

                    <div className="wrap-register__input" data-validate="email is required">
                        <input className="wrap-register__input-container" type="email" name="email" placeholder="Email"/>
                        <span className="wrap-register__input-symbol">
                            <i className="far fa-envelope"></i>
                        </span>
                    </div>

                    <div className="wrap-register__input" data-validate="username is required">
                        <input className="wrap-register__input-container" type="username" name="username" placeholder="Username"/>
                        <span className="wrap-register__input-symbol">
                            <i className="far fa-user"></i>
                        </span>
                    </div>

                    <div className="wrap-register__input" data-validate="password is required">
                        <input className="wrap-register__input-container" type="password" name="password" placeholder="Password"/>
                        <span className="wrap-register__input-symbol">
                            <i className="fas fa-unlock-alt"></i>
                        </span>
                    </div>

                    
                    <div className="wrap-register__input" data-validate="verified password is required">
                        <input className="wrap-register__input-container" type="password" name="verifiedPassword" placeholder="Verified Password"/>
                        <span className="wrap-register__input-symbol">
                            <i className="fas fa-unlock-alt"></i>
                        </span>
                    </div>

                    <div className="wrap-register_btnContainer btnContainer">
                        <input type="submit" className="btnContainer__btn" value="Register"></input>
                    </div>
            </form>


                    <div className="form-register__textContainer">
                        
                        <Link className="form-register__textContainer-a" to="/">go Back?</Link>
                        
                    </div>
                        
                    <p className="form-register__copyright">@copyright by Adrían Zhu</p>     
            </div>
            {error && < Feedback message={error} onClose={onClose}/>}
    </div>
</section>
    
})