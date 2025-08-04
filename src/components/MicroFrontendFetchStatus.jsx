import React from "react";
import { Alert, AlertTitle } from "@mui/material";

export const MicroFrontendFetchStatus = (props) => {
  if (props.status !== "SUCCESS" && props.status !== "LOADING") {
    return (
      <Alert severity="error">
        <AlertTitle>Oops!!</AlertTitle>
        {props.label || "Error loading micro frontend"}
      </Alert>
    );
  } else {
    return null;
  }
};
