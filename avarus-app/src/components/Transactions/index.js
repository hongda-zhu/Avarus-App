import React from 'react'
import './index.sass'
import {withRouter } from 'react-router-dom'
import TransactionsItem from '../TransactionsItem'


function Transactions ({transactions }) { 

    return <section className="transactions">

    <span className="transactions-span">Aquí están tus transaciones</span>

    {transactions &&  <ul className="transactions-lists lists">
        {transactions.map(transaction => <li className="lists-transaction" key={transaction.time}><TransactionsItem transaction={transaction} /></li>)}
    </ul>}


</section> 
} 

export default withRouter(Transactions)