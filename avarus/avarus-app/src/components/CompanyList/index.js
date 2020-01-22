import React from 'react'
import Company from '../Company'


export default function ({ companies, token }) { 

    
    return <ul className="button-list list">
        {companies.map(company => <li className="list-stock stock" key={company.name}><Company company={company} token={token}/></li>)}
    </ul>
}