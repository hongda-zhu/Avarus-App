import React, {useState, useEffect} from 'react'
import './index.sass'
import Landing from '../Landing'
import Register from '../Register'
import Login from '../Login'
import Header from '../Header'
import Main from '../Main/'
import Detail from '../Detail'
import Transactions from '../Transactions'
import Operations from '../Operations'
import Footer from '../Footer'
import Feedback from '../Feedback'
import Favorites from '../Favorites'
import UserPage from '../PersonalProfile'
import { Route, withRouter, Redirect } from 'react-router-dom'
import { registerUser, authenticateUser, retrieveUser, editUser} from '../../logic'

export default withRouter(function ({ history }) {

    const API_URL = process.env.REACT_APP_API_URL

    const [email, setEmail] = useState()

    const [username, setUsername] = useState()

    const [budget, setBudget] = useState()

    const [password, setPassword] = useState()

    const [error, setError] = useState()

    const [id, setId] = useState()

    const [picture, setPicture] = useState()

    const [transactions, setTransactions] = useState([])

    const [favorites, setFavorites] = useState([])


    useEffect(() => { 

      refreshAll()

    }, []) // transactions, sessionStorage.token, favorites


    async function refreshAll(){
      
      const { token } = sessionStorage;
        
          if (token) { 
              
              let user = await retrieveUser(token)
              
              const {id, email, username, password, budget, transactions, favorites} = user

              let imageUser = user.image

              imageUser && (imageUser = `${API_URL}/users/load/${id}?timestamp=${Date.now()}`)

              setBudget(budget.toFixed(4))
              setId(id)
              setUsername(username)
              setEmail(email)
              setPassword(password)
              setTransactions(transactions)
              setFavorites(favorites)
              setPicture(imageUser)

          }
    }
    
    async function handleRegister(email, username, password, verifiedPassword){
        try {
        
          const budget = 5000

          await registerUser(email, username, password, verifiedPassword, budget)
        
          history.push('/login')

        } catch(error){

          const { message } = error

          setError(message)

        }
      }

    async function handleLogin(username, password){
      
      try{ 
        
          const token = await authenticateUser(username, password)

          sessionStorage.token = token

          history.push("/main")

      }catch(error){

        const { message } = error
      
        setError((message))

      }
  }

  async function handleModifyUser(email, password, verifiedPassword) {


    try {
        debugger 

        const { token } = sessionStorage
      
        await editUser(token, email, password, verifiedPassword) 
        

        history.push('/main')
    } catch (error) {
        const { message } = error
        setError(message)
    }
}

  async function handleLogout () {

    sessionStorage.clear()
    history.push('/')

  }

  async function handleGoBack() {
    history.goBack()
  }

  async function handleCloseError () {
    setError(undefined)
  }

  const { token } = sessionStorage


  return <> 
      {token && <> <Header name={username} budget={budget} onLogout={handleLogout} picture={picture} picture={picture} userId={id}/></>} 
      
      <Route exact path='/' render={() => !token ? <Landing />: <Main error={error} onClose={handleCloseError} token={token}/> }/>

      <Route path = '/register' render ={() => !token ? <Register onRegister={handleRegister} error={error} onClose={handleCloseError}/> : <Redirect to="/main" /> }  />

      <Route path = '/login' render = {() => !token ? <Login onLogin={handleLogin} error={error} onClose={handleCloseError}/> : <Redirect to="/" /> } />  

      <Route path = '/main' render = {() =>  <Main error={error} onClose={handleCloseError} token={token} /> } />

      <Route path = '/detail/:id' render={({ match: { params: { id:companyId } } })  => token && id ? <> <Detail userId={id} companyId={companyId} onBuy={refreshAll}/> </>: <Redirect to="/" />  } />

      <Route path="/userpage" render={() => token ? <UserPage email={email} username={username} password={password} picture={picture} onModifyUser={handleModifyUser} onBack={handleGoBack} error={error} onClose={handleCloseError} refreshAll={refreshAll}  /> : <Redirect to="/" />} />

      <Route path = '/transactions' render={() => transactions && token && id && <Transactions  userId={id} transactions={transactions} error={error} onClose={handleCloseError} />  } />

      <Route path = '/favorites' render={() => transactions && token && id && <Favorites favorites={favorites} />  } />
      
      <Route path = '/detailTransactions/:id/' render={({ match: { params: { id:transactionId } } })  => token && id ? <> <Operations transactionId={transactionId} error={error} onClose={handleCloseError} onSell={refreshAll}/> </>: <Redirect to="/" />  } />
  
      {/* <MainContext.Provider value={{setName}} >
      </MainContext.Provider> */}
      {token && <> <Footer /></>} 
      
      {error && <Feedback message={error} onClose={handleCloseError}/>}
      
  </>
  
})