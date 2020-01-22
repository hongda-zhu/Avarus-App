import React, { useState, useEffect }  from 'react'
import {toggleFav, retrieveCompanyById} from '../../logic'
import './index.sass'


export default function ({token, companyId}) {
    const [company, setCompany] = useState({})

    useEffect(()=>{
        (async () => {
            try {
                
                await refreshUserFav()
            } catch ({message}) {
                console.log(message)
            }
        })()
    })


    async function refreshUserFav(){
        
        try {
            
                const updateCompany = await retrieveCompanyById(companyId, token)
                
                setCompany(updateCompany)


            
         } catch ({message}) {
            console.log(message)
         }
    }

    async function onFav(event){
        try {


            event.preventDefault()

            event.stopPropagation()

            await toggleFav(token, companyId) 
            
            await refreshUserFav()


        } catch ({message}) {
            console.log(message)

        }
    }

    return  <>
               

               { company && (company.isFav ? 
               
                    <span className="btn-fav" onClick={onFav}><i className="fas fa-money-bill-alt"></i></span> :
                    <span className="btn-fav" onClick={onFav}><i className="far fa-money-bill-alt"></i></span>)

                }
                
            </>
           
}