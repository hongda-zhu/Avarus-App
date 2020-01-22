export default [

    {
        name: 'tech',
        contentText: 'Tech'
    },
    {
        name: 'food',
        contentText: 'Food'
    },
    {
        name: 'banking',
        contentText: 'Banking'
    },
    {
        name: 'sports',
        contentText: 'Sports'
    },
    {
        name: 'gaming',
        contentText: 'Gaming'
    },
    {
        name: 'fashion',
        contentText: 'Fashion'
    }

]

// export default withRouter (function ({handleCategoryQuery, companies, error, onClose}) {

//     function handleGoToCategory (event){ 

//         event.preventDefault()
                    
//         const categoryType = event.target.value
        
//         handleCategoryQuery(categoryType)
//     }

//     return<nav className="main-nav">
//                 <form className="nav__form" onSubmit={handleGoToCategory}> 
//                     <select name="categoryType" className="input__select" onChange={handleGoToCategory} >
//                 {config.map(category => {return <option value= {category.name}>{category.contentText}</option>})}
//                     </select>
                  
//                 </form>
        
//     </nav> 
// })
