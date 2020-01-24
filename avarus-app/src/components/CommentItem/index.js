import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import moment from "moment"

export default withRouter(function ({ token, comment, onModifyComment, onDeleteComment }) {

    const { _id: commentId, body, date } = comment

    const newTime = moment(date).format("DD-MMM-YYYY HH:mm:ss")
    
    debugger
    return <section className="comments">
        <div className="comments__container container">
            <h3 className="container__title">Comment</h3>
            <form className="container__form form" onSubmit={event => {

                event.preventDefault()
                event.stopPropagation()
                
                const {
                    body:{value: body}
                } = event.target

                onModifyComment(token, commentId, body)


                }}>

                <div className="wrap-edit__input" >
                    <textarea rows="4" cols="24" className="wrap-edit__input-container" type="text" name="body" placeholder="comment " defaultValue={body}/>
                </div>

                <div className="wrap-edit__input">
                    <input className="wrap-edit__input-container" type="string" name="date" placeholder="Date" readOnly value={newTime} />
                </div>

                <div className="form__buttons buttons">

                    <div className="buttons__modify-info modify-info">
                        <button className="modify-info__button" type="submit" >Edit</button>
                    </div>

                </div>
            </form>

            <div className="buttons__back-button back-button">
                <button className="back-button__button" onClick={event => {
                    event.preventDefault()

                    onDeleteComment(token, commentId)
                }}>Delete</button>
            </div>


        </div>
    </section>
});