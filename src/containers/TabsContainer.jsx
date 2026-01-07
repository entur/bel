import { connect } from "react-redux";

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

import React from "react";
import { withRouter } from "react-router-dom";
import { MicroFrontendFetchStatus } from "../components/MicroFrontendFetchStatus.jsx";
import { MicroFrontend } from "@entur/micro-frontend";
import { Tab } from "@mui/material";
import { darkColor } from "../styles/themes/entur";
import { TabContext, TabList, TabPanel } from "@mui/lab";

class TabsContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  handleChange(_e, value) {
    this.props.history.push(`/${value}`);
  }

  render() {
    const { currentSupplier, getToken, isLoading, config } = this.props;

    return (
      <TabContext value={this.props.tab}>
        <TabList
          onChange={this.handleChange.bind(this)}
          variant="fullWidth"
          sx={{ background: darkColor }}
        >
          <Tab
            value="status"
            label={
              <span style={{ color: "white", paddingTop: "12px" }}>
                Linjestatus
              </span>
            }
          />
          <Tab
            value="events"
            label={
              <span style={{ color: "white", paddingTop: "12px" }}>
                Dataleveranser
              </span>
            }
          />
        </TabList>

        {this.props.tab === "status" && currentSupplier && !isLoading ? (
          <TabPanel value={this.props.tab} index={0}>
            {config.ninsarMicroFrontendUrl && (
              <MicroFrontend
                id="ror-ninsar"
                host={config.ninsarMicroFrontendUrl}
                staticPath=""
                name="Line statistics"
                payload={{
                  providerId: `${currentSupplier.id}`,
                  getToken,
                  locale: "NO",
                  showNumberOfLinesCard: true,
                  showDeliveryDateCard: true,
                  showExpiringDaysCard: true,
                }}
                FetchStatus={(props) => (
                  <MicroFrontendFetchStatus
                    {...props}
                    label="Error loading line statistics"
                  />
                )}
                handleError={(error) => console.log(error)}
              />
            )}
          </TabPanel>
        ) : null}

        {this.props.tab === "events" && currentSupplier && !isLoading ? (
          <TabPanel value={this.props.tab} index={0}>
            <MicroFrontend
              id="ror-zagmuk"
              host={config.zagmukMicroFrontendUrl}
              staticPath=""
              name="Events"
              payload={{
                providerId: `${currentSupplier.id}`,
                provider: currentSupplier,
                getToken,
                locale: "nb",
                env: config.appEnv,
                hideIgnoredExportNetexBlocks: true,
                hideAntuValidationSteps: false,
                hideFlexDataImport: false,
                navigate: (url) => this.props.history.push(url),
              }}
              FetchStatus={(props) => (
                <MicroFrontendFetchStatus
                  {...props}
                  label="Error loading events"
                />
              )}
              handleError={(error) => console.log(error)}
            />
          </TabPanel>
        ) : null}
      </TabContext>
    );
  }
}

const mapStateToProps = (state) => ({
  currentSupplier: state.asyncReducer.currentSupplier,
  isLoading: state.asyncReducer.isLoading,
  config: state.config,
});

export default withRouter(connect(mapStateToProps)(TabsContainer));
