import React, {useState, useEffect} from 'react'
import {withRouter } from 'react-router-dom'
import './index.sass'
import {retrieveCompanies} from '../../logic'
import CompanyList from '../CompanyList'


function Favorites ({favorites}) { 

    const {token} = sessionStorage

    return <section className="favorites">

        <span className="favorites-span">Aquí están tus favoritos</span>

        <div className="favorites-print">

        {favorites && < CompanyList companies={favorites} token={token}/>}

        </div>


</section> 
} 

export default withRouter(Favorites)