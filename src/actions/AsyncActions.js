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

import axios from "axios";
import * as types from "./actionTypes";

const AsyncActions = {};

const getConfig = (auth) => {
  let config = {};
  const accessToken = auth.user?.access_token;
  config.headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: "Bearer " + accessToken,
    "Et-Client-Name": "entur-bel",
  };
  return config;
};

AsyncActions.changeActiveProvider = (id) => async (dispatch) => {
  dispatch(sendData(id, types.CHANGED_ACTIVE_PROVIDER));
};

AsyncActions.getAllSuppliers = (auth) => async (dispatch, getState) => {
  dispatch(sendData(null, types.REQUESTED_SUPPLIERS));

  const state = getState();
  const url = state.config.providersBaseUrl;

  return axios({
    url: url,
    timeout: 20000,
    method: "get",
    responseType: "json",
    ...getConfig(auth),
  })
    .then((response) => {
      dispatch(sendData(response.data, types.RECEIVED_SUPPLIERS));
      const userOrganisations = response.data;

      if (userOrganisations.length) {
        dispatch(
          sendData(userOrganisations[0].id, types.CHANGED_ACTIVE_PROVIDER)
        );
      } else {
        dispatch(sendData(null, types.USER_NO_ORGANISATIONS));
      }
    })
    .catch((response) => {
      dispatch(sendData(response.data, types.ERROR_SUPPLIERS));
    });
};

export const sendData = (payLoad, type) => ({
  payLoad,
  type,
});

export default AsyncActions;
