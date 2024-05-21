import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import "./style.css";

const HightLight = () => {
  const { highlightStatus, highlightColourCode, highlight, secondrythemeColourCode } = useSelector(
    (state: RootState) => state.StoreReducer.customerDetails
  );
  return highlightStatus ? (
    <div
      className="highlight-width-edit"
      style={{
        backgroundColor: highlightColourCode === "" ? "" : highlightColourCode,
        minHeight: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: secondrythemeColourCode
      }}
    >
      <h5 style={{ textTransform: "capitalize", marginBottom: "0px" }}>
        {highlight.split("\n").map((line: string, index: number) => (
          <React.Fragment key={index}>
            {line}
            {highlight.split("\n").length !== 2 && <br />}
          </React.Fragment>
        ))}
      </h5>
    </div>
  ) : (
    ""
  );
};

export default HightLight;
