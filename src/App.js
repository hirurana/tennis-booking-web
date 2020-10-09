// index.js
// This is the main entry point of our application
import React from 'react'
import ReactDOM from 'react-dom'
import {
    ApolloClient,
    ApolloProvider,
    createHttpLink,
    InMemoryCache,
} from '@apollo/client'
import { setContext } from 'apollo-link-context'

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

// check for a local token
const data = {
    isLoggedIn: !!localStorage.getItem('token'),
}

// write the cache data on initial load
cache.writeData({ data })

// write the cache data after cache is reset via log out button
client.onResetStore(() => cache.writeData({ data }))

const App = () => {
    return (
        <ApolloProvider client={client}>
            <GlobalStyle />
            <Pages />
        </ApolloProvider>
    )
}
ReactDOM.render(<App />, document.getElementById('root'))
