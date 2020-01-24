import React from 'react'
import './index.sass'
import { withRouter } from 'react-router-dom'
const moment = require('moment')


export default withRouter(function ({ sellRegister }) {  

    const {amount, quantity, time} = sellRegister

    let exactTime = moment(time).format("DD/MM/YY hh:mm") 
    let ajustedAmount = amount.toFixed(5) 

    return <a className="sellRegister-items items">
        {/* <img src={image} className="items-img"></img> */}
        <h3 className="items-time">{exactTime}</h3>
        <p className="items-name">sellout quantity: {quantity}</p>
        <p className="items-amount">sellout gain: {ajustedAmount}</p>
    </a>
})