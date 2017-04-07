import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import Root from './containers/Root'
import configureStore from './store/store'
import cfgreader from './config/readConfig'
import Keycloak from 'keycloak-js'
import axios from 'axios'

import injectTapEventPlugin from 'react-tap-event-plugin'
import './styles/css/main.css'
injectTapEventPlugin()

cfgreader.readConfig( (function(config) {
  window.config = config
  authWithKeyCloak(config.endpointBase)
}).bind(this))


function authWithKeyCloak(endpointBase) {

  let kc = new Keycloak(endpointBase + 'config/keycloak.json')

  kc.init({ onLoad: 'login-required', checkLoginIframe: false }).success( authenticated => {

    if (authenticated) {
      setInterval(() => {
        kc.updateToken(10).error(() => kc.logout())
        axios.interceptors.request.use(config => {
          config.headers = {...config.headers, ...{
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: 'Bearer ' + kc.token
          }}
          return config;
        })

      }, 10000)

      renderIndex(kc)

    } else {
      kc.login()
    }
  })
}

function renderIndex(kc) {

  const store = configureStore(kc)

  ReactDOM.render(
    <Provider store={store}>
        <Root/>
      </Provider>,
    document.getElementById('root')
  )
}
