import React, { useEffect } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import AsyncActions from "../actions/AsyncActions";

const MicroFrontendWrapper = ({ dispatch, match, supplierList, children }) => {
  useEffect(() => {
    if (match.params.codespace) {
      const supplier = supplierList.find(
        (supplier) =>
          supplier.chouetteInfo.referential === match.params.codespace
      );
      if (supplier) {
        dispatch(AsyncActions.changeActiveProvider(supplier.id));
      }
    }
  }, [match, supplierList]);

  return <>{children}</>;
};

const mapStateToProps = (state) => ({
  supplierList: state.asyncReducer.suppliers,
});

export default withRouter(connect(mapStateToProps)(MicroFrontendWrapper));
