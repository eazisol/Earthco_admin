import React, { useEffect, useState } from 'react';
import { TextField, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import DashboardLayout from '../DashboardLayout/DashboardLayout';
import TitleBar from '../TitleBar';
import { getTenantById } from '../../APIS/auth';
import { AddTenant } from '../../APIS/auth';
import { toast } from 'react-toastify';

const DemoPasswordFields = () => {
    const [tenant, setTenant] = useState(null);

    const [formData, setFormData] = useState({
        oldPassword: '',
        Password: '',
        confirmPassword: ''
    });

    const [showPasswords, setShowPasswords] = useState({
        oldPassword: false,
        Password: false,
        confirmPassword: false
    });

    const [error, setError] = useState({
        oldPassword: '',
        Password: '',
        confirmPassword: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords((prev) => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        const fetchTenant = async () => {
            try {
                const data = await getTenantById(user?.Data?.TenantId);
                setTenant(data);
            } catch (err) {
                console.error("Error fetching tenant", err);
            }
        };

        if (user?.Data?.TenantId) {
            fetchTenant();
        }
    }, []);

    useEffect(() => {
        const newErrors = {};
        const { oldPassword, Password, confirmPassword } = formData;

        // Old password check
        if (oldPassword && tenant?.data?.Password && oldPassword !== tenant.data.Password) {
            newErrors.oldPassword = "Old password is incorrect";
        }

        // New password validation
        if (Password) {
            if (Password.length < 8) {
                newErrors.Password = "Password must be at least 8 characters";
            } else if (!/[A-Z]/.test(Password)) {
                newErrors.Password = "Must contain at least one uppercase letter";
            } else if (!/\d/.test(Password)) {
                newErrors.Password = "Must contain at least one number";
            } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(Password)) {
                newErrors.Password = "Must contain at least one special character";
            } else if (Password === oldPassword) {
                newErrors.Password = "New password cannot be same as old password";
            }
        }

        // Confirm password check
        if (confirmPassword && Password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setError(newErrors);
    }, [formData, tenant]);

    const validateForm = () => {
        return (
            formData.oldPassword &&
            formData.Password &&
            formData.confirmPassword &&
            Object.values(error).every((err) => err === "")
        );
    };

    const handleSubmit = async () => {
        const data = {
            TenantId: tenant?.data?.TenantId,
            FirstName: tenant?.data?.FirstName,
            LastName: tenant?.data?.LastName,
            Email:tenant?.data?.Email,
            Password:formData.Password,
            SubDomain: tenant?.data?.SubDomain,
            CompanyName:tenant?.data?.CompanyName,
            PhoneNo: tenant?.data?.PhoneNo,
            RoleId: tenant?.data?.RoleId,
        
        }
       const response=await AddTenant(data)
       toast.success('Password updated successfully.')
    }

    return (
        <DashboardLayout>
            <div className="content-body">
                <TitleBar title="Change Password" />
               
                <div className="container-fluid">
          <div className="row table-space">
            <div className="col-xl-5">
              <div className="card">
                <div className="card-body p-0">
                  <div className="row">
                  <div className="container-fluid">
                    <div className="col-xl-12 mb-4">
                        <label className="form-label">Current Password</label>
                        
                        <TextField
                            className="form-control form-control-sm"
                            name="oldPassword"
                            value={formData.oldPassword}
                            onChange={handleInputChange}
                            size="small"
                            type={showPasswords.oldPassword ? "text" : "password"}
                            error={!!error.oldPassword}
                            helperText={error.oldPassword}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => togglePasswordVisibility('oldPassword')}
                                            edge="end"
                                        >
                                            {showPasswords.oldPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </div>

                    <div className="col-xl-12 mb-4">
                        <label className="form-label">New Password</label>
                        <TextField
                            className="form-control form-control-sm"
                            name="Password"
                            value={formData.Password}
                            onChange={handleInputChange}
                            size="small"
                            type={showPasswords.Password ? "text" : "password"}
                            error={!!error.Password}
                            helperText={error.Password}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => togglePasswordVisibility('Password')}
                                            edge="end"
                                        >
                                            {showPasswords.Password ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </div>
             
                    <div className="col-xl-12 mb-4">
                        <label className="form-label">Confirm New Password</label>
                        <TextField
                            className="form-control form-control-sm"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            size="small"
                            type={showPasswords.confirmPassword ? "text" : "password"}
                            error={!!error.confirmPassword}
                            helperText={error.confirmPassword}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => togglePasswordVisibility('confirmPassword')}
                                            edge="end"
                                        >
                                            {showPasswords.confirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </div>
                    <p className="mt-2 mb-1 ">&#8226; At least 8 characters</p>
            <p className="mb-1 ">&#8226; At least 1 number</p>
            <p className=" ">&#8226; At least 1 upper case letter</p>
                    <div className="col-xl-12 mb-5">
                        <button
                            className="btn btn-primary w-100"
                            onClick={handleSubmit}
                            disabled={!validateForm()}
                        >
                            Update
                        </button>
                    </div>
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

export default DemoPasswordFields;
