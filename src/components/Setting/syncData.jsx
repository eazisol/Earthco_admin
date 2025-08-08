import DashboardLayout from "../DashboardLayout/DashboardLayout";
import {
  CircularProgress,
  FormControl,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useMemo, useState,useRef } from "react";
import { Offcanvas } from "bootstrap";
import { toast } from "react-toastify";
import {
  addPackage,
  deletePackage,
  getPackages,
  getPackagesType,
} from "../../APIS/packages";
import { ConfirmationModal } from "../Reuseable/ConfirmationModal";
import Pagination from '@mui/material/Pagination';
import TitleBar from "../TitleBar";

export const SyncData = () => {
  

  return (
    <DashboardLayout>
     
 
      <div className="content-body">
 <TitleBar icon={ <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M13.5 2.53H7.41C5.5 2.52 3.94 4.04 3.9 5.95V15.77C3.85 17.71 5.39 19.31 7.33 19.36H14.73C16.65 19.28 18.17 17.69 18.15 15.77V7.37L13.5 2.53Z"
              stroke='#888888'
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13.27 2.52V5.19C13.27 6.49 14.32 7.54 15.62 7.55H18.15"
              stroke='#888888'
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13.1 14.08H8.15"
              stroke='#888888'
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11.22 10.64H8.15"
              stroke='#888888'
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>} title="Data Sync" />
        <div className="container-fluid">
          <div className="row table-space">
            <div className="col-xl-12">
              <div className="card">
                <div className="card-body p-0">
                  <div className="table-responsive active-projects style-1">
                    <iframe
                      src={`https://api.earthcoapp.com/Home/Tokens`}
                      scrolling="no"
                      style={{
                        height: "calc(100vh - 150px)", // Adjusted height to prevent cutting
                        width: "100%",
                        overflowY: "hidden",
                        marginTop: "-1.5%",
                      }}
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
