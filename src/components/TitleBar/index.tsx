import React from "react";

const TitleBar = ({ icon, title,safetyIcon=false }) => {
  return (
    <div style={{height : "40px"}}>
    <div className="page-titles" style={{position : "fixed", width : "100%",top:"44px" }}>
      <ol className="breadcrumb">
        <div className="menu-icon  me-2">{safetyIcon?  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M13.5096 2.53165H7.41104C5.50437 2.52432 3.94146 4.04415 3.89654 5.9499V15.7701C3.85437 17.7071 5.38979 19.3121 7.32671 19.3552C7.35512 19.3552 7.38262 19.3561 7.41104 19.3552H14.7343C16.6538 19.2773 18.1663 17.6915 18.1525 15.7701V7.36798L13.5096 2.53165Z" stroke="#888888" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M13.2688 2.52084V5.18742C13.2688 6.48909 14.3211 7.54417 15.6228 7.54784H18.1482" stroke="#888888" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M13.0974 14.0786H8.1474" stroke="#888888" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M11.2229 10.6388H8.14655" stroke="#888888" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>:icon}</div>
        <li>
          <h5 className="bc-title ">{title}</h5>
        </li>
      </ol>
    </div></div>
  );
};

export default TitleBar;
