import React, {Component} from 'react'
import { Line } from 'react-chartjs-2'
import moment from 'moment'
import labelsValues from './labelsValues'
import {retrieveCompanyById, producePrice} from '../../logic'

// una logica para sacar el x 

// escoger solamente valores del último día

const initialState = {  
  labels:labelsValues,
  datasets: [
    {
      label: `Today\s' stocks`,
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: []
    }
  ]
};

export default class Charts extends Component {

    state = initialState;

    componentDidMount()
    {
        const _this = this;
        let newData = [];

        setInterval(function () {
            const oldDataSet = _this.state.datasets[0];
    
            
            (async () => {
                try {
                    // await producePrice()
                    const film = await retrieveCompanyById(_this.props.companyId, _this.props.token)
                    const stocksArr = film.stocks
                    // console.log(stocksArr)

                    newData = [];
                    stocksArr.map(stock => {
                        let formatTime = moment(stock.time).format('DD/MM/YYYY')
                        let todayTime = moment(new Date()).format('DD/MM/YYYY')
                        if( formatTime === todayTime) return newData.push(stock.price) 
                        
                    })

                    if(moment(stocksArr[film.stocks.length - 1].time).format('DD/MM/YYYY') !== moment(new Date()).format('DD/MM/YYYY')) newData = []
                    
   
                } catch({message}) {
                    console.log({message})
                }

                
            })()


            const newDataSet = {
                ...oldDataSet
            };

            newDataSet.data = newData;

            const newState = {
                ...initialState,
                datasets: [newDataSet]
            };

            _this.setState(newState);
        }, 1000);

        
    }
    
      componentDidUpdate(prevProps) {
  
      }
    
      componentWillUnmount() {
        
      }
      

    

  render() {
    return<div className="container-charts charts">

        {/* <ul className="charts-list list">
            <li className="list-item item">
                <button className="item-btn">
                    DAY
                </button>
            </li>
            <li className="list-item item">
                <button className="item-btn">
                    WEEK
                </button>
            </li>
            <li className="list-item item">
                <button className="item-btn">
                    MONTH
                </button>
            </li>
            <li className="list-item item">
                <button className="item-btn">
                    MAX
                </button>
            </li>
        </ul>
         */}
        
        <div>
            
            <Line ref="chart" data={this.state} />
            {/* <Line data={this.data} redraw /> */}
        </div>
        
        
    </div> 
    
  }

  
}

// function AxisX () {

//     return (async () => {

//         const STOCKS_INTERVAL = 60000 //* 60 * 60 // ms

//         let arr = []

//         const initialTime = new Date('2019-12-10 00:00:00').getTime()

//         let lastTime = new Date('2019-12-10 23:59:00').getTime()

//         const diff = lastTime - initialTime

//         let gap = Math.floor(diff/ STOCKS_INTERVAL)

//         for (let i = 0; i <= gap; i++) {

//             let currentTime = lastTime + STOCKS_INTERVAL

//             let newTime = new Date(currentTime)
            
//             arr.push(moment(newTime).format('HH/mm/ss'))

//             lastTime = currentTime
//         }

//         return arr

//     })()
// }