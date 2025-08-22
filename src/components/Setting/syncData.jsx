import DashboardLayout from "../DashboardLayout/DashboardLayout";
import { useEffect, useState } from "react";
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
import SyncAltOutlinedIcon from '@mui/icons-material/SyncAltOutlined'
import {
  CircularProgress,
  FormControl,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { getCompanyList } from "../../APIS/companies";
import { useAppContext } from "../../context/AppContext";

export const SyncData = () => {
  const { loginUser } = useAppContext();
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [employeesData, setEmployeesData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [fakeLoader, setFakeLoader] = useState(true);

  useEffect(() => {
    setFakeLoader(true);
    const timeout = setTimeout(() => {
      setFakeLoader(false);
    }, Math.floor(Math.random() * 1000) + 5000); 
    return () => clearTimeout(timeout);
  }, []);

  const fetchCompanies = async () => {
    setLoader(true);
    const response = await getCompanyList();
    setEmployeesData(response?.data?.Data);
    setLoader(false);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return (
    <DashboardLayout>
      <div className="content-body">
        <TitleBar icon={<SyncAltOutlinedIcon />} title="Sync QuickBooks Data" />
        <div className="container-fluid">
          <div className="row table-space">
            <div className="col-xl-12">
              <div className="card shadow-sm rounded-card">
                <div className="card-body p-0">
                  <div className="col-xl-3 mb-3 " style={{ paddingLeft: "2%", paddingTop: "1%" }}>
                    <FormControl fullWidth>
                      <label className="form-label">
                        Select Company
                      </label>
                      <Select
                        name="PackageTypeId"
                        value={selectedCompany}
                        onChange={(e) => setSelectedCompany(e.target.value)}
                        style={{ height: "2.5rem" }}
                      >
                        {employeesData?.map((option) => {
                          return (
                            <MenuItem key={option.CompanyRealmId} value={option.CompanyRealmId}>
                              {option.CompanyName}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </div>
                  <div className="table-responsive active-projects style-1" style={{ minHeight: "300px" }}>
                    {fakeLoader || loader ? (
                      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "calc(100vh - 200px)" }}>
                        <CircularProgress  />
                    
                      </div>
                    ) : (
                      <iframe
                        src={`https://api.earthcoapp.com/Home/Tokens/?Value=${loginUser?.Data?.SubDomain}&GetCompanyId=${selectedCompany}`}
                        scrolling="no"
                        style={{
                          height: "calc(100vh - 150px)", 
                          width: "100%",
                          overflowY: "hidden",
                          marginTop: "-3.5%",
                        }}
                        title="QuickBooks Sync"
                      ></iframe>
                    )}
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
