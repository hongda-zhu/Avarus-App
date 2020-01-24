import React from 'react'
import './index.sass'
import { withRouter } from 'react-router-dom'
const moment = require('moment')


export default withRouter(function ({ history, transaction, onClose }) {  

    const {amount, company, time} = transaction

    let exactTime = moment(time).format("DD/MM/YY hh:mm")
    const {name} = company 
    let ajustedAmount = amount > 0 ? amount.toFixed(5): 0

    function goToDetail() { 
        if(!transaction.id) transaction.id = transaction._id

        history.push(`/detailTransactions/${transaction.id }`)
        
    }

    return <a className="transactions-items items" onClick = {function (event){
        event.preventDefault()
        goToDetail()
    }}>
        {/* <img src={image} className="items-img"></img> */}
        <h3 className="items__time">{exactTime}</h3>
        <p className="items__name">{name}</p>
        <p className="items__amount">{ajustedAmount}</p>
        <div className="items__close" onClick={ event => {
            event.preventDefault()
           /*  onClose() */
        }}>✖︎</div>
    </a>
})