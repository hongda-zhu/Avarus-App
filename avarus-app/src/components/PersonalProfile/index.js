import React from 'react'
import { Link } from 'react-router-dom'
import { saveUserPicture } from '../../logic'
import Feedback from '../Feedback'
import './index.sass'


export default function ({ email, username, password, picture, onModifyUser, onBack, error, onClose, refreshAll }) {

    async function onSaveImageUser(event) {
        
        event.preventDefault()
        const { file: { files: [image] } } = event.target
        try {
            const { token } = sessionStorage
            await saveUserPicture(token, image)
            await refreshAll()

        } catch (error) {
            console.log(error)
        }
    }

    return <section className="userpage">
        <div className="userpage__container container">
            <h3 className="container__title">Personal Info</h3>
            
            <form className='container-picture picture' onSubmit={
                    onSaveImageUser}>
                    <p className="picture-formula_title">Add a profile picture</p>
                    <input className="picture-formula_inp" type="file" name="file" accept="image/*" />
                    <button className="picture-formula_btn">Save</button>
            </form>

            
            <div className="conatiner-picture picture">

            <label><img className="user-container_image" src={picture ? picture : "images/default/default-user.png"}/></label>

            <div className="picture-btn btn"></div>
            <button ></button>

            </div>

            <form className="container__form form" onSubmit={event => {

                event.preventDefault()
                event.stopPropagation()

                const {
                    email: { value: email },
                    password: { value: password },
                    verifiedPassword: { value: verifiedPassword },
                } = event.target

                debugger

                onModifyUser(email, password, verifiedPassword)
            }}>

                <div className="wrap-edit__input" data-validate="username is required">
                    <input className="wrap-edit__input-container" type="username" name="username" placeholder="Username " defaultValue={username} readOnly />
                    <span className="wrap-edit__input-symbol">
                        <i className="far fa-user"></i>
                    </span>
                </div>

                <div className="wrap-edit__input" data-validate="email is required">
                    <input className="wrap-edit__input-container" type="email" name="email" placeholder="Email" defaultValue={email} />
                    <span className="wrap-edit__input-symbol">
                        <i className="far fa-envelope"></i>
                    </span>
                </div>

                <div className="wrap-edit__input" data-validate="password is required">
                    <input className="wrap-edit__input-container" type="password" name="password" placeholder="Password" />
                    <span className="wrap-edit__input-symbol">
                        <i className="fas fa-unlock-alt"></i>
                    </span>
                </div>

                <div className="wrap-edit__input" data-validate="verified password is required">
                    <input className="wrap-edit__input-container" type="password" name="verifiedPassword" placeholder="Verified Password" />
                    <span className="wrap-edit__input-symbol">
                        <i className="fas fa-unlock-alt"></i>
                    </span>
                </div>
                <div className="form__buttons buttons">

                    <div className="buttons__modify-info modify-info">
                        <button className="modify-info__button">edit Info</button>
                    </div>

                    <div className="buttons__back-button back-button">
                        <button className="back-button__button" onClick={event => {
                            event.preventDefault()

                            onBack()
                        }}>Go Back</button>
                    </div>
                </div>
            </form>
    </div>
        
        {error && <Feedback message={error} onClose={onClose} />}
    </section>
}


// import React from 'react'
// import './index.sass'
// import Feedback from '../Feedback'

// export default function ({ email, username, password, onModifyUser, onBack, error, onClose }) {
//     return <section className="userpage">
//         <div className="userpage__container container">
//             <h3 className="container__title">Personal Info</h3>
//             <form className="container__form form" onSubmit={event => {

//                 event.preventDefault()
//                 event.stopPropagation()

//                 const {
//                     email: { value: email },
//                     password: { value: password },
//                     verifiedPassword: { value: verifiedPassword },
//                 } = event.target

//                 debugger

//                 onModifyUser(email, password, verifiedPassword)
//             }}>

//                 <div className="wrap-edit__input" data-validate="username is required">
//                     <input className="wrap-edit__input-container" type="username" name="username" placeholder="Username " defaultValue={username} readOnly />
//                     <span className="wrap-edit__input-symbol">
//                         <i className="far fa-user"></i>
//                     </span>
//                 </div>

//                 <div className="wrap-edit__input" data-validate="email is required">
//                     <input className="wrap-edit__input-container" type="email" name="email" placeholder="Email" defaultValue={email} />
//                     <span className="wrap-edit__input-symbol">
//                         <i className="far fa-envelope"></i>
//                     </span>
//                 </div>

//                 <div className="wrap-edit__input" data-validate="password is required">
//                     <input className="wrap-edit__input-container" type="password" name="password" placeholder="Password" />
//                     <span className="wrap-edit__input-symbol">
//                         <i className="fas fa-unlock-alt"></i>
//                     </span>
//                 </div>

//                 <div className="wrap-edit__input" data-validate="verified password is required">
//                     <input className="wrap-edit__input-container" type="password" name="verifiedPassword" placeholder="Verified Password" />
//                     <span className="wrap-edit__input-symbol">
//                         <i className="fas fa-unlock-alt"></i>
//                     </span>
//                 </div>
//                 <div className="form__buttons buttons">

//                     <div className="buttons__modify-info modify-info">
//                         <button className="modify-info__button">edit Info</button>
//                     </div>

//                     <div className="buttons__back-button back-button">
//                         <button className="back-button__button" onClick={event => {
//                             event.preventDefault()

//                             onBack()
//                         }}>Go Back</button>
//                     </div>
//                 </div>
//             </form>
//         </div>

//         {error && <Feedback message={error} onClose={onClose} />}
//     </section>
// }

