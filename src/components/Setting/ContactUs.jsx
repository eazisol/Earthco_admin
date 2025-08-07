import DashboardLayout from "../DashboardLayout/DashboardLayout";
import image from "../../assets/img/team/team-1.jpg";
import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { Offcanvas } from "bootstrap";
import { getTenantServerSideList } from "../../APIS/transactions";
import { useAppContext } from "../../context/AppContext";
// Add Material UI Pagination
import Pagination from '@mui/material/Pagination';
import TitleBar from "../TitleBar";
import { ConfirmationModal } from "../Reuseable/ConfirmationModal";
import { contactUs, deleteContactUs } from "../../APIS/settings";
import { toast } from "react-toastify";

export const ContactUs = () => {
    const { loginUser } = useAppContext();
    const [selectedId, setSelectedId] = useState(0);
    const [openForm, setOpenForm] = useState(false);
    const [transactionsData, setTransactionsData] = useState([]);
    // Pagination and search state
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalConfig, setModalConfig] = useState({
      title: "",
      description: "",
      onConfirm: () => {},
      confirmText: "",
      cancelText: "",
    });
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        maxUser: "",
        maxStorage: "",
        monthlyPrice: "",
        maxCompanies: "",
    });
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Define fields that should only allow numbers
        const numericFields = [
            "maxUser",
            "maxStorage",
            "monthlyPrice",
            "maxCompanies",
        ];

        // Check if it's a numeric-only field
        if (numericFields.includes(name)) {
            // Allow only digits (and optionally decimals here)
            const isValid = /^\d*$/.test(value); // Change to /^\d*\.?\d*$/ if decimals are allowed
            if (!isValid) return; // Don't update if invalid
        }

        // Update state
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };



    // Fetch transactions with search and pagination
    const fetchTransactions = async (searchValue = search, pageValue = page, pageSizeValue = pageSize) => {
        setLoading(true);
        try {
            const data = await contactUs({ DisplayStart: pageValue, DisplayLength: pageSizeValue });
            setTransactionsData(data?.data?.Data);
            setTotalCount(data?.totalRecords || 0);
        } catch (e) {
            setTransactionsData([]);
            setTotalCount(0);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchTransactions();
        // eslint-disable-next-line
    }, [page, pageSize]);

    // Search handler
    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setPage(1);
        fetchTransactions(e.target.value, 1, pageSize);
    };

    // Pagination handler
    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleDelete = async (id) => {
          console.log(id);
          const data = await deleteContactUs(id);
          if(data?.status==200){
            toast.success(data?.data?.Message);
            fetchTransactions();
          }else{
            toast.error(data?.Message);
          }
    };

    return (
        <DashboardLayout>
            <ConfirmationModal
             modalOpen={modalOpen}
             setModalOpen={setModalOpen}
                title={modalConfig.title}
                description={modalConfig.description}
                onConfirm={modalConfig.onConfirm}
            />
            <div className="content-body">
                <TitleBar title="Contact Us" />
                <div className="container-fluid">
                    <div className="row table-space"  >
                        <div className="col-xl-12">
                            <div className="card">
                                <div className="card-body p-0">
                                    <div className="table-responsive active-projects style-1">
                                       
                                        <table id="employees-tblwrapper" className="table" style={{width:"100%"}}>
                                            <thead>
                                                <tr>
                                                    <th style={{width:"20%"}}>Name</th>
                                                    <th style={{width:"50%"}}>Message</th>
                                                    <th style={{width:"10%"}}>Date</th>
                                                    <th style={{width:"10%"}}>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {loading ? (
                                                    <tr><td colSpan={4} className="text-center">Loading...</td></tr>
                                                ) : transactionsData?.length === 0 ? (
                                                    <tr><td colSpan={4} className="text-center">No data found</td></tr>
                                                ) : (
                                                    transactionsData?.map((transaction, index) => (
                                                        <tr key={index} className="hover-effect">
                                                            <td >
                                                                <span>{transaction.Name}</span><br />
                                                                <span>{transaction.Email}</span>
                                                            </td>
                                                            <td style={{textWrap:"wrap"}}>
                                                               {transaction.Message}
                                                            </td>
                                                            <td >
                                                                <span>{transaction.CreatedDate
                                                                    ? new Date(transaction.CreatedDate).toLocaleDateString() : '-'}</span>
                                                            </td>
                                                            <td >
                                                                <i
                                                                    className="fa-solid fa-trash text-danger cursor-pointer delete-icon"
                                                                    title="Delete Contact"
                                                                    style={{ cursor: 'pointer' }}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setModalOpen(true);
                                                                        setModalConfig({
                                                                            title: "Confirmation",
                                                                            description: "Are you sure you want to delete this contact?",
                                                                            onConfirm: () => {
                                                                                handleDelete(transaction.ContactMessagesId);
                                                                                setModalOpen(false);
                                                                            },
                                                                            confirmText: "Delete",
                                                                            cancelText: "Cancel",
                                                                        });
                                                                    }}
                                                                ></i>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                      
                                        {/* Pagination Controls */}
                                        <div className="d-flex justify-content-end align-items-center p-3">
                                            <Pagination
                                                count={Math.ceil(totalCount / pageSize)}
                                                page={page}
                                                onChange={handlePageChange}
                                                color="#b0e15b"
                                                shape="rounded"
                                                showFirstButton
                                                showLastButton
                                            />
                                        </div>
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
