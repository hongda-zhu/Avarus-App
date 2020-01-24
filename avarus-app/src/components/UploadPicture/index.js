// import React from 'react'
// import Feedback from '../Feedback'
// import { saveUserPicture } from '../../logic'
// import { withRouter } from 'react-router-dom'

// export default withRouter (function ({refreshAll, onBack}) {

//     async function onSaveImageUser(event) {
        
//         event.preventDefault()
//         const { file: { files: [image] } } = event.target
//         try {
//             const { token } = sessionStorage
//             await saveUserPicture(token, image)
//             await refreshAll()

//         } catch (error) {
//             console.log(error)
//         }
//     }
//     return <div className="upload">
    
//         <form className='upload-picture picture' onSubmit={onSaveImageUser)}>
//             <p className="picture-instructions">Add a profile picture</p>
//             <input className="picture-search" type="file" name="file" accept="image/*" />
//             <button className="picture-btn">Save</button>
//         </form>

//         <div className="upload-btn btn"> <button className="btn-goback" value="Go Back" onClick={ ()=> {onBack()}}></button></div>

//         {/* {error && <Feedback message={error} onClose={onClose} />} */}
//     </div>
// })
