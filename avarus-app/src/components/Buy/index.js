import React, {useState, useEffect}  from 'react'
import { buyIn} from '../../logic'
import { parse } from 'path'
import { set } from 'mongoose'
import Feedback from '../Feedback'


export default function ({userId, companyId, stockId, error, onClose, onBuy}) {

    // const [num, setNum] = useState(0)

    async function handleBuyIn(userId, companyId, stockId, operation, quantity){

        try { 

            await buyIn(userId, companyId, stockId, operation, quantity)
            
            onBuy()

        } catch({message}) {

            console.log(message)

        }
    }

    return <div className="boxes-buy buy">
    <span className="buy-text">How many would you like to buy ?</span>
    {/* <div className="buy-prices prices">
        <ul className="prices-list list">
            <li className="list-price price">
                <button className="price-btn" value="2" onClick={event => 
                    setNum(event.target.value)}>
                    2
                </button>
            </li>
            <li className="list-price price" >
                <button className="price-btn" value="5" onClick={event => setNum(event.target.value)}>
                    5
                </button>
            </li>
            <li className="list-price price">
                <button className="price-btn" value="10" onClick={event => setNum(event.target.value)}>
                    10
                </button>
            </li>
            <li className="list-price price">
                <button className="price-btn" value="25" onClick={event => setNum(event.target.value)}>
                    25
                </button>
            </li>
        </ul>
    </div> */}
    
    <div type="submit" className="buy-search search">
        <form className="search-formula formula" onSubmit={
            function(event){ 

                try {
                    
                    event.preventDefault()
                    const {quantity: {value:quantity}} = event.target
                    const operation = 'buy-in'
                    const numberQuantity = parseInt(quantity)
                    handleBuyIn (userId, companyId, stockId, operation, numberQuantity)
                    
                } catch({message}) {
                    console.log(message)
                }

            }
        }>  
            <input className="formula-container" type="number"  name="quantity"  placeholder="How many"  />

            <button className="formula-btn">Pick stock</button>
            
        </form>

        </div>
        
        {error && < Feedback message={error} onClose={onClose}/>}

    </div> 
    }