/*
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
 * the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *   https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and
 * limitations under the Licence.
 *
 */

import React, { useContext } from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import Root from "./containers/Root";
import configureStore from "./store/store";
import cfgreader from "./config/readConfig";
import AuthProvider, { useAuth } from "@entur/auth-provider";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

import "./styles/css/main.scss";
import { BrowserRouter } from "react-router-dom";
import { ConfigContext } from "./config/ConfigContext";

const AuthenticatedApp = () => {
  const config = useContext(ConfigContext);
  const auth = useAuth();

  if (process.env.NODE_ENV === "production") {
    Sentry.init({
      dsn: config.sentryDSN,
      integrations: [new BrowserTracing()],

      // We recommend adjusting this value in production, or using tracesSampler
      // for finer control
      tracesSampleRate: 1.0,
      environment: config.appEnv,
      release: `bel@${process.env.REACT_APP_VERSION}`,
    });
  }

  if (auth.isLoading || !auth.isAuthenticated || !auth.roleAssignments) {
    return null;
  }

  return (
    <Sentry.ErrorBoundary showDialog>
      <Provider store={configureStore(auth, config)}>
        <Root />
      </Provider>
    </Sentry.ErrorBoundary>
  );
};

function renderIndex(config) {
  render(
    <AuthProvider
      auth0Config={{
        domain: config.auth0Domain,
        clientId: config.auth0ClientId,
        audience: config.auth0Audience,
        redirectUri: window.location.origin,
      }}
      auth0ClaimsNamespace={config.auth0ClaimsNamespace}
    >
      <ConfigContext.Provider value={config}>
        <BrowserRouter>
          <AuthenticatedApp />
        </BrowserRouter>
      </ConfigContext.Provider>
    </AuthProvider>,
    document.getElementById("root")
  );
}

cfgreader.readConfig((config) => {
  renderIndex(config);
});
