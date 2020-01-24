import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import Feedback from "../Feedback";
import CommentItem from "../CommentItem";
import "./index.sass";
import { createComment, retrieveComments, editComment, deleteComment } from "../../logic";

function Comments({ transactionId }) {
    const [comments, setComments] = useState({});
    const [bodyValue, setBodyValue] = useState('')

    const { token } = sessionStorage;

    useEffect(() => {
        (async () => {
            try {
                await refreshComments(token, transactionId);
            } catch ({ message }) {
                console.log(message);
            }
        })();
    }, []);

    async function refreshComments(token, transactionId) {
        try {
            
            const updateComments = await retrieveComments(token, transactionId)
            
            setComments(updateComments)
        } catch ({ message }) {
            console.log(message)
        }
    }

    async function handleOnCreateComment(token, transactionId, body) {
        try {
            await createComment(token, transactionId, body);

            await refreshComments(token, transactionId);

        } catch (error) {
            console.log(error.message);
        }
    }

    async function handleOnModifyComment(token, commentId, body) {
        try {
            debugger
            await editComment(token, commentId, body)

            await refreshComments(token, transactionId);

        } catch ({ message }) {
            console.log(message)

        }
    }

    async function handleOnDeleteComment(token, commentId) {

        try {

            await deleteComment(token, commentId)

            await refreshComments(token, transactionId);

        } catch ({ message }) {
            console.log(message)

        }
    }

    async function onChangeValues (event){

        const {valueOfBody} = event.target

        setBodyValue(valueOfBody)
    }

    return (
        <section className="sellRegisters">
            <form
                type="submit"
                className="sellRegisters-formula"
                onSubmit={event => {

                    event.preventDefault()

                    event.stopPropagation()

                    let {
                        body: { value: body }
                    } = event.target

                    handleOnCreateComment(token, transactionId, body);

                    setBodyValue("")
                }}
            >
                <div className="sellRegisters__input" data-validate="body is required">
                    <input
                        className="sellRegisters__input-container"
                        type="text"
                        name="body"
                        placeholder="write here your comment"
                        value={bodyValue}
                        onChange={onChangeValues}
                    />
                    <span className="sellRegisters__input-symbol">
                        <i className="far fa-comments"></i>
                    </span>
                </div>

                <div className="sellRegisters_btnContainer btnContainer">
                    <input
                      type="submit"
                        className="btnContainer__btn"
                        value="Create"
                    ></input>
                </div>
            </form>

            <span className="sellRegisters-span">Comments</span>

            {comments.length > 0 ? (
                <ul className="sellRegisters-lists lists">
                    {comments.map(comment => (
                        <li className="lists-sellRegister" key={comment._id}>
                            <CommentItem token={token} comment={comment} onModifyComment={handleOnModifyComment} onDeleteComment={handleOnDeleteComment} />
                        </li>
                    ))}
                </ul>
            ) : (
                    <p className="lists-sellRegister">
                        There has not comment related
                    </p>
                )}

            {/* {error && <Feedback message={error} onClose={onClose} />} */}
        </section>
    );
}

export default withRouter(Comments);
