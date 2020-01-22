import React, {useState, useEffect} from 'react'
import './index.sass'
import {withRouter } from 'react-router-dom'
import Feedback from '../Feedback'
import SelloutItem from '../SelloutItem'


function Sellout ({sellRegisters, error, onClose }) { 

    return <section className="sellRegisters">

    <span className="sellRegisters-span">Sales</span>

        {sellRegisters.length > 0 ?  <ul className="sellRegisters-lists lists">
            {sellRegisters.map(sellRegister => <li className="lists-sellRegister" key={sellRegister._id}><SelloutItem sellRegister={sellRegister} /></li>)}
        </ul>: <p className="lists-sellRegister">This transaction has not sellout register related</p>}

        {error && < Feedback message={error} onClose={onClose}/>}

    </section> 
} 

export default withRouter(Sellout)
