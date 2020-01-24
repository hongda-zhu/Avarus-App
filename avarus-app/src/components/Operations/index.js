import React, { useState, useEffect } from 'react'
import './index.sass'
import Slide from '../Slide'
import Comments from '../Comments'
import Sellout from '../Sellout'
import { priceProducer } from '../../utils'
import { Link } from 'react-router-dom';
import { Route, withRouter, Redirect } from 'react-router-dom'
import { retrieveBuyin, sellOut, retrieveComments } from '../../logic'
import { format, parse } from 'path'
const moment = require('moment')

export default withRouter(function ({ history, transactionId, onSell }) {

    const [slide, setSlide] = useState('history')
    const [transactionDetail, setTransactionDetail] = useState()
    const [purchasedPrice, setPurchasedPrice] = useState()
    const [costs, setCosts] = useState()
    const [purchasedTime, setPurchasedTime] = useState()
    const [detail, setDetail] = useState()
    const [lastStockTime, setLastStockTime] = useState()
    const [error, setError] = useState()
    const [currentPrice, setCurrentPrice] = useState()
    const [gain, setGain] = useState(0)
    const [gainResult, setGainResult] = useState()
    const [relatedTo, setRelatedTo] = useState([])
    // const [commentsList, setCommentsList] = useState([])

    let refresher

    const { token } = sessionStorage

    useEffect(() => {
        if (typeof refresher !== 'number') refresher = setInterval(() => {

            (async () => {

                try {

                    const transactionDetail = await retrieveBuyin(transactionId)
                    setTransactionDetail(transactionDetail)

                    // let commentsArray = await retrieveComments(token, transactionId)
                    // setCommentsList(commentsArray)

                    const { company } = transactionDetail
                    setDetail(company)

                    let currentPrice = company.stocks[company.stocks.length - 1].price.toFixed(4)
                    setCurrentPrice(currentPrice)

                    const { stockSelected } = transactionDetail
                    const purchasedPrice = stockSelected.price.toFixed(4)
                    setPurchasedPrice(purchasedPrice)

                    const { amount } = transactionDetail
                    const costs = amount.toFixed(4)
                    setCosts(costs)

                    const { relatedTo } = transactionDetail
                    setRelatedTo(relatedTo)


                    const { time } = transactionDetail
                    const purchasedTime = moment(time).format('DD/MM/YY hh:mm')
                    setPurchasedTime(purchasedTime)

                    let lastStockTime = moment(company.stocks[company.stocks.length - 1].time).format('DD/MM/YY hh:mm')

                    setLastStockTime(lastStockTime)

                } catch (error) {

                    setError(error.message)

                }
            })()
        }, 60000);

        (async () => {
            try {

                const transactionDetail = await retrieveBuyin(transactionId)
                setTransactionDetail(transactionDetail)

                // let commentsArray = await retrieveComments(token, transactionId)
                // setCommentsList(commentsArray)

                const { company } = transactionDetail
                setDetail(company)

                let currentPrice = company.stocks[company.stocks.length - 1].price.toFixed(4)
                setCurrentPrice(currentPrice)

                const { stockSelected } = transactionDetail
                const purchasedPrice = stockSelected.price.toFixed(4)
                setPurchasedPrice(purchasedPrice)

                const { amount } = transactionDetail
                const costs = amount.toFixed(4)
                setCosts(costs)

                const { time } = transactionDetail
                const purchasedTime = moment(time).format('DD/MM/YY hh:mm')
                setPurchasedTime(purchasedTime)

                const { relatedTo } = transactionDetail
                setRelatedTo(relatedTo)

                let lastStockTime = moment(company.stocks[company.stocks.length - 1].time).format('DD/MM/YY hh:mm')

                setLastStockTime(lastStockTime)


            } catch (error) {
                setError(error.message)
            }
        })()

        return () => { clearInterval(refresher) }
    }, [error, transactionDetail, currentPrice, setGainResult, setGain, gain])


    async function handleslideName(slideName) {

        switch (slideName) {
            case 'goback':
                setSlide('goback');
                break;
            case 'history':
                setSlide('history');
                break;
            case 'comments':
                setSlide('comments');
                break;
        }
    }

    async function handleOnSell(userId, companyId, stockId, buyInTransactionId, operation, quantity) {
        try {

            quantity = parseInt(quantity)

            await sellOut(userId, companyId, stockId, buyInTransactionId, operation, quantity)

            onSell()


        } catch ({ message }) {

            console.log(message)

        }
    }

    async function goBackMain(event) {

        try {

            event.stopPropagation()
            event.preventDefault()
            // history.push('/main')
            history.goBack()

        } catch ({ message }) {

            console.log(message)

        }

    }


    return <> {transactionDetail && <section className="operations">

        <div className="operations-boxes boxes">

            <div className="boxes-buyin buyin">

                <div className="buyin-title">

                    Purchase

                </div>

                <div className="buyin-information information">
                    <div className="information-detail detail">
                        <div className="detail-property">Current Price</div>
                        <div className="detail-property">Price</div>
                        <div className="detail-property">Quantity</div>
                        <div className="detail-property">Costs</div>
                        <div className="detail-property">Purchased Date</div>
                        <div className="detail-property">Current Date</div>
                        <div className="detail-property">Company</div>
                    </div>

                    <div className="information-detail detail">
                        <div className="detail-property">{currentPrice}</div>
                        <div className="detail-property">{purchasedPrice}</div>
                        <div className="detail-property">{transactionDetail.quantity}</div>
                        <div className="detail-property">{costs}</div>
                        <div className="detail-property">{purchasedTime}</div>
                        <div className="detail-property">{lastStockTime}</div>
                        <div className="detail-property">{transactionDetail.company.name}</div>
                    </div>
                </div>
            </div>

            <form className="container-sellout sellout" onSubmit={function (event) {
                event.preventDefault()
                const { quantity: { value: quantity } } = event.target
                const operation = 'sell-out'

                handleOnSell(transactionDetail.user._id, transactionDetail.company._id, transactionDetail.stockSelected._id, transactionId, operation, quantity)
            }

            }>


                <div className="sellout-title">

                    Sale

            </div>

                <div className="sellout-information information">
                    <div className="information-detail detail">
                        <div className="detail-property">Quantity</div>
                        <div className="detail-property">Gain</div>
                    </div>

                    <div className="information-detail detail">

                        {transactionDetail.quantity > 0 ? <input className="detail-boxes " type="quantity" name="quantity" onChange={event => {
                            setGain(event.target.value)
                            setGainResult(gain * currentPrice)
                        }} value={gain}></input> : <div className="detail-block"> 0 </div>}


                        {gainResult >= 0 ? <div className="detail-property">{gainResult}</div> : <div className="detail-property"> 0 </div>}

                    </div>
                </div>

                <div className="sellout-btn btn">


                    {transactionDetail.quantity > 0 ? <input className="btn-click" type="submit" value="confirm"></input> : <input className="btn-click" type="submit" value="confirm" disabled></input>}

                </div>

            </form>

            <div className="container-buttons buttons">

                <nav className="container-navegator navegator">
                    <div className="navegator-btn">
                        <button className="navegator-btn__form" onClick={goBackMain} >goBack</button>
                    </div>

                    <Slide handleslideName={handleslideName} detail={undefined} />

                    {slide === 'history' && <Sellout sellRegisters={relatedTo} />}
                    {slide === 'comments' && <Comments transactionId={transactionId} />}


                </nav>

            </div>

        </div>

    </section>} </>
})