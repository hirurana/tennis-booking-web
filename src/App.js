// index.js
// This is the main entry point of our application
import React from 'react'
import ReactDOM from 'react-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import {
    ApolloClient,
    ApolloProvider,
    createHttpLink,
    InMemoryCache,
} from '@apollo/client'
import { setContext } from 'apollo-link-context'
import { BrowserRouter as Router } from 'react-router-dom'

// import top level components to be rendered
import Pages from '/pages'
import GlobalStyle from '/components/GlobalStyle'

//configure our API_URI and cache
const uri = process.env.API_URI
const httpLink = createHttpLink({ uri })
const cache = new InMemoryCache()

// check for a token and return the headers to the context
const authLink = setContext((_, { headers }) => {
    return {
        headers: {
            ...headers,
            authorization: localStorage.getItem('token') || '',
        },
    }
})

// configure Apollo Client
const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache,
    resolvers: {},
    connectToDevTools: true,
})

const App = () => {
    return (
        <ApolloProvider client={client}>
            <Router>
                <GlobalStyle />
                <Pages />
            </Router>
        </ApolloProvider>
    )
}
ReactDOM.render(<App />, document.getElementById('root'))
