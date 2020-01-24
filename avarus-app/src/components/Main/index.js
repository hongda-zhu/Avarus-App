import React, {useState, useEffect} from 'react'
import './index.sass'
import {withRouter } from 'react-router-dom'
import Feedback from '../Feedback'
import Search from '../Search'
import {retrieveCompanies} from '../../logic'

function Main ({error, onClose, token }) { 

    const [companies, setCompanies] = useState([])

    // const [user, setUser] = useState()

    useEffect(()=>{

        (async()=>{

            try{

                handleSearchAll(token)
                

            }catch(message){

                console.log(`${message}`)

            }

        })()
        
    }, [])



    async function handleSearchAll(token){

        try { 

            debugger
            const companies = await retrieveCompanies(undefined, token)
            
            setCompanies(companies)

        }catch({message}){
            
            console.log(`${message}`)

        }

    }

    async function handleSearchName(query, token) {

        try { 

            const companies = await retrieveCompanies(query, token)
    
            setCompanies(companies)

        }catch({message}){
            
            console.log(`${message}`)

        }

    }

    async function handleCategoryQuery(categoryType, token) {

        try {

            const companies = await retrieveCompanies(categoryType, token)
    
            setCompanies(companies)

        }catch({message}){
            
            console.log(`${message}`)

        }

    }

    return  <main className="main">

    <span className="main-span">Choose the stocks you'd like to give</span>
    
    <Search handleNameQuery={handleSearchName} handleCategoryQuery={handleCategoryQuery} companies={companies}  message={error} onClose={onClose} token={token}/>

    {error && < Feedback message={error} onClose={onClose}/>}

</main>
}

export default withRouter(Main)