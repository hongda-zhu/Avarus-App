import React, {useState, useEffect} from 'react'
import './index.sass'
import Slide from '../Slide'
import Buy from '../Buy'
import Charts from '../Charts'
import Stats from '../Stats'
import About from '../About'
import FavoriteBtn from '../FavoriteBtn'
import { withRouter } from 'react-router-dom'
import {retrieveCompanyById, producePrice} from '../../logic'


export default withRouter(function ({userId, companyId, history, onBuy}) { 

    const [slide, setSlide] = useState('buy')
    const [detail, setDetail] = useState()
    const [stockId, setStockId] = useState()
    const [error, setError] = useState()
    const [currentPrice, setCurrentPrice] = useState()
    const [comparison, setComparison] = useState()
    const [lastPrice, setLastPrice] = useState()
    let refresher

    const {token} = sessionStorage

    
        
    useEffect(()=>{
        if (typeof refresher !== 'number' ) refresher = setInterval(()=>{

            (async()=>{  

                try{
                    await producePrice()
                    const companyDetail = await retrieveCompanyById(companyId, token)

                    setDetail(companyDetail) 
    
                    let currentPrice = companyDetail.stocks[companyDetail.stocks.length - 1].price.toFixed(6)

                    setCurrentPrice(currentPrice)

                    let lastPrice = companyDetail.stocks[companyDetail.stocks.length - 2].price.toFixed(6)

                    setLastPrice(lastPrice)

                    let comparison = currentPrice - lastPrice

                    setComparison(comparison.toFixed(4))

                    let lastStockId = companyDetail.stocks[companyDetail.stocks.length - 1].id

                    setStockId(lastStockId)
                    
                } catch(error){

                    setError(error.message)
                    
                }
            })()
        }, 60000);
 
        (async()=>{
            try{
                await producePrice()
                const companyDetail = await retrieveCompanyById(companyId, token)

                setDetail(companyDetail)

                let currentPrice = companyDetail.stocks[companyDetail.stocks.length - 1].price.toFixed(6)

                setCurrentPrice(currentPrice)

                let lastPrice = companyDetail.stocks[companyDetail.stocks.length - 2].price.toFixed(6)

                setLastPrice(lastPrice)

                let comparison = currentPrice - lastPrice
                
                setComparison(comparison.toFixed(4))

                let lastStockId = companyDetail.stocks[companyDetail.stocks.length - 1]._id

                setStockId(lastStockId)

                
                
            } catch(error){
                setError(error.message)                
            }
        })() 

        return () => { clearInterval(refresher)}
    },[error, detail, currentPrice])


    async function handleslideName(slideName, detail){
        
        switch(slideName){
            case 'buy':
                setSlide('buy');
            break;
            case 'charts':
                setSlide('charts');
                break;
            case 'stats':
                setSlide('stats');
                break;
            case 'about':
                setSlide('about');
                break;
        }
   }

    async function goBackMain(event){
        event.stopPropagation()
        event.preventDefault()
        // history.push('/main')
        history.goBack()

    } 

    return <>{  detail && <section className="detail hidden">
    <div className="detail-container container">

        <div className="container-description description">
            <p className="description-title">{detail.name}</p>
            <button className ="description-button" onClick={goBackMain} >goBack</button>
            <img src="https://www.skylabcoders.com/images/408/facebook.png" className="description-image" />
            <p className="description-currentValue">${currentPrice}</p>
            {comparison < 0 ? <p className="description-percentage__red"><i className="fas fa-arrow-down"></i> {comparison}</p> :
            <p className="description-percentage__green"><i className="fas fa-arrow-up"></i> {comparison}</p> }
            <FavoriteBtn token={token} companyId={companyId }  />
        </div>

        <nav className="container-navegator navegator">


            <Slide handleslideName={handleslideName} detail={detail}/>

            {slide === 'buy' && <Buy userId={userId} companyId={companyId} stockId={stockId} onBuy={onBuy}/>} 
            {slide === 'charts' && <Charts companyId={companyId} token={token} />}
            {slide === 'stats' && <Stats companyId={companyId} token={token} />}
            {slide === 'about' && <About Headquarters={detail.description}/>}
            
        </nav>

    </div>
</section>} </>

})