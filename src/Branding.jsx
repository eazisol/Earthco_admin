import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  CustomButton,
  CustomButtonGreen,
  CustomButtonRec,
} from "./components/CustomButton";
import { useNavigate } from "react-router";
import HeroSection from "./components/HeroSection";
import { getPackages } from "./APIS/packages";
import { ConfirmationModal } from "./components/Reuseable/ConfirmationModal";
import { AddContactMessage } from "./APIS/auth";
import { toast } from "react-toastify";


function Branding() {
  const [loginUser,setLoginUser] = useState(null)
  
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    description: "",
    onConfirm: () => {},
    confirmText: "",
    cancelText: "",
  });
  let navigate = useNavigate();
  const [packages,setPackages] = useState([])
  const [formData, setFormData] = useState({
    Name: "",
    Email: "",
    Subject: "",
    Message: "",
  });
useEffect(()=>{
  const user = localStorage.getItem("user")
  if(user){
    setLoginUser(JSON.parse(user))
  }
},[])
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
const [isLoading,setIsLoading] = useState(false)
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name' && value.length >= 50) {
      return;
    }
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.Name.trim()) {
      newErrors.Name = "Name is required";
    } else if (formData.Name.trim().length < 2) {
      newErrors.Name = "Name must be at least 2 characters long";
    } else if (formData.Name.trim().length >= 50) {
      newErrors.Name = "Name cannot exceed 50 characters";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.Email) {
      newErrors.Email = "Email is required";
    } else if (!emailRegex.test(formData.Email)) {
      newErrors.Email = "Please enter a valid email address";
    }

    // Subject validation
    if (!formData.Subject.trim()) {
      newErrors.Subject = "Subject is required";
    }

    // Message validation
    if (!formData.Message.trim()) {
      newErrors.Message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    } setIsSubmitting(true);
    setIsLoading(true)
   const data = await AddContactMessage(formData)
   toast.success(data?.Message)
   setIsSubmitting(false);
   setFormData({
    Name: "",
    Email: "",
    Subject: "",
    Message: "",
   })
   setIsLoading(false)
  };
  const fetchPackages = async (searchValue = '', pageValue = 1, pageSizeValue = 10) => {
  
    const response = await getPackages({
      Search: searchValue || "",
      DisplayStart: pageValue,
      DisplayLength: pageSizeValue,
    });
    setPackages(response?.Data)
   
  };
  useEffect(() => {
    fetchPackages();
  }, []);
// const handleSubscription=async(packageId)=>{
//   if(loginUser?.token?.data){
//     setModalOpen(true);
//     setModalConfig({
//       title: "Confirmation",
//       description: "Are you sure you want to subscribe to this package?",
//       onConfirm: async() => {
       
//       },
//       confirmText: "Subscribe",
//       cancelText: "Cancel",
//     });
//   //   const data = await checkPackageStatus();
//   //   console.log("🚀 ~ handleSubscription ~ data:", data)
//   //   if(data?.status==200){
//   //  }
//   }else{
//     navigate(`/register?packageId=${packageId}`)

//   }
// }
const handleSubscription=async(packageId)=>{
  
    navigate(`/register?packageId=${packageId}`)
  
}
  useEffect(() => {
    const preloader = document.getElementById("preloader");
    if (preloader) {
      preloader.style.display = "none";
    }

    // Header scroll effect
    const selectHeader = document.querySelector("#header");
    if (selectHeader) {
      let headerOffset = selectHeader.offsetTop;
      let nextElement = selectHeader.nextElementSibling;

      const headerScrolled = () => {
        if (window.pageYOffset > headerOffset) {
          selectHeader.classList.add("header-scrolled");
        } else {
          selectHeader.classList.remove("header-scrolled");
        }
      };

      window.addEventListener("load", headerScrolled);
      window.addEventListener("scroll", headerScrolled);
    }
  }, []);
  return (
    <>
      {/* ======= Hero Section ======= */}
      <HeroSection />
      <ConfirmationModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        title={modalConfig.title}
        description={modalConfig.description}
        onConfirm={modalConfig.onConfirm}
        confirmText={modalConfig.confirmText}
        cancelText={modalConfig.cancelText}
      />
  
      <main id="main">
        {/* ======= About Us Section ======= */}
        <section id="about" className="about">
          <div className="container" data-aos="fade-up">
            <div className="section-title">
              <h2>About Us</h2>
            </div>
            <div className="row content">
              <div className="col-lg-6">
                <p className="text-start">
                  Welcome to Earthco Landscape, where we transform outdoor
                  spaces into stunning, sustainable landscapes that enhance both
                  beauty and functionality.
                </p>
                <ul className="text-start">
                  <li>
                    <i
                      className="ri-check-double-line"
                      style={{ color: "#3A7D0E" }}
                    ></i>{" "}
                    Expert landscape design and installation with meticulous
                    attention to detail
                  </li>
                  <li>
                    <i
                      className="ri-check-double-line"
                      style={{ color: "#3A7D0E" }}
                    ></i>{" "}
                    Eco-friendly maintenance solutions that preserve and protect
                    your landscape investment
                  </li>
                  <li>
                    <i
                      className="ri-check-double-line"
                      style={{ color: "#3A7D0E" }}
                    ></i>{" "}
                    Expert horticultural knowledge and sustainable landscaping
                    practices
                  </li>
                </ul>
              </div>
              <div className="col-lg-6 pt-4 pt-lg-0 text-start">
                <p>
                  With years of experience in the landscaping industry, our
                  dedicated team combines creativity with technical expertise to
                  deliver exceptional outdoor environments. We pride ourselves
                  on using sustainable practices and high-quality materials to
                  create landscapes that not only look beautiful but also
                  contribute positively to the environment. From residential
                  gardens to commercial properties, we're committed to exceeding
                  our clients' expectations with innovative solutions and
                  reliable service.
                </p>
                <CustomButtonRec text="Learn More" />
              </div>
            </div>
          </div>
        </section>

        {/* ======= Services Section ======= */}
        <section id="services" className="services section-bg">
          <div className="container" data-aos="fade-up">
            <div className="section-title">
              <h2>Services</h2>
              <p>
                At Earthco Landscape, we offer comprehensive landscaping
                solutions tailored to your needs. Our expert team delivers
                professional services ranging from design and installation to
                maintenance and sustainability consulting, ensuring your outdoor
                spaces thrive year-round.
              </p>
            </div>
            <div className="row">
              {[
                {
                  icon: "bx bxl-dribbble",
                  title: "Automated Report Generation",
                  description:
                    "Our platform offers powerful reporting tools for agents and admins. Generate weekly or monthly reports, view them instantly in the system, and download as professionally formatted PDFs. These reports support performance tracking, accountability, and better decision-making.",
                  delay: "100",
                },
                {
                  icon: "bx bx-file",
                  title: "Smart Invoice Management",
                  description:
                    "Easily create, send, and manage invoices with our intuitive billing system. Track payment status, apply taxes or discounts, and generate recurring invoices as needed. Download or email invoices in professional PDF format directly from the system.",
                  delay: "200",
                },
                {
                  icon: "bx bx-tachometer",
                  title: "Accurate Estimate Management",
                  description:
                    "Quickly generate and manage job estimates tailored to client needs. Add services, materials, and pricing with full flexibility. Share detailed estimates via PDF or email, and track their approval status in real-time.",
                  delay: "300",
                },
                {
                  icon: "bx bx-layer",
                  title: "Purchase Order & Billing Management",
                  description:
                    "Easily create purchase orders, track vendor transactions, and manage billing workflows from a single interface. Link POs to estimates or invoices, monitor status updates, and keep financial records organized.",
                  delay: "400",
                },
              ].map((service, index) => (
                <div
                  key={index}
                  className={`col-xl-3 col-md-6 text-start d-flex align-items-stretch ${
                    index > 1
                      ? "mt-4 mt-xl-0"
                      : index === 1
                      ? "mt-4 mt-md-0"
                      : ""
                  }`}
                  data-aos="zoom-in"
                  data-aos-delay={service.delay}
                >
                  <div className="icon-box">
                    <div className="icon">
                      <i
                        className={service.icon}
                        style={{ color: "#3A7D0E" }}
                      ></i>
                    </div>
                    <h4>
                      <a href="">{service.title}</a>
                    </h4>
                    <p>{service.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ======= Cta Section ======= */}
        <section id="cta" className="cta mt-5">
          <div className="container" data-aos="zoom-in">
            <div className="row">
              <div className="col-lg-9 text-center text-lg-start">
                <h3>Call To Action</h3>
                <p>
                  {" "}
                  Transform your outdoor space into a sustainable paradise with
                  our expert landscaping services. Contact us today to schedule
                  a consultation and take the first step towards creating the
                  landscape of your dreams.
                </p>
              </div>

              <div className="col-lg-3 cta-btn-container text-center">
                <CustomButton text="Call To Action" />
              </div>
            </div>
          </div>
        </section>

        {/* ======= Pricing Section ======= */}
     
<section id="pricing" className="pricing" >
  <div className="container" data-aos="fade-up">
    <div className="section-title">
      <h2>Pricing</h2>
      <p >
        At Earthco, we believe in honest pricing with no hidden fees.
        Our flexible service packages are designed to give you the best
        value — whether you're managing a single business or multiple
        operations through QuickBooks.
      </p>
    </div>

    <div className="row justify-content-center align-items-end" >
    
      {packages.map((plan, index) => {
        return (
          <div
            key={index}
            className={`col-lg-4 mt-4 mt-lg-0 text-start `}
            data-aos="fade-up"
            data-aos-delay={plan.delay}
            style={{marginBottom:"20px"}}
          >
            <div className={`box featured`}>
              <h3>{plan.Name}</h3>
              <h4>
                <sup>$</sup>
                {plan.Price}
                <span className="per-month">per month</span>
              </h4>
              <p>{plan?.Description}</p>
              <ul>
              
                <li><i class="bx bx-check"></i>{`Limited to ${plan.MaxCompanies} company and ${plan?.MaxUser} users`}</li>
                <li><i class="bx bx-check"></i>{`${plan.MaxStorageMB} MB storage capacity`}</li>
                <li><i class="bx bx-check"></i>{`Affordable pricing for basic needs`}</li>
                <li><i class="bx bx-check"></i>{`Email support only`}</li>
              </ul>
        
              <CustomButton onClick={() => handleSubscription(plan.PackageId)}/>
            </div>
          </div>
        );
      })}
   
    </div>
  </div>
</section>

          
        {/* ======= Contact Section ======= */}

        <section id="contact" className="contact">
          <div className="container" data-aos="fade-up">
            <div className="section-title">
              <h2>Contact</h2>
              <p>
                Have a question, need a quote, or want to schedule a
                consultation? We're here to help! Reach out to our team and
                we'll respond promptly to discuss your landscaping needs.
              </p>
            </div>
            <div className="row">
              <div className="col-lg-5 d-flex align-items-stretch">
                <div className="info text-start h-100">
                  <div className="address">
                    <i className="bi bi-geo-alt"></i>
                    <h4>Location:</h4>
                    <p>A108 Adam Street, New York, NY 535022</p>
                  </div>
                  <div className="email">
                    <i className="bi bi-envelope"></i>
                    <h4>Email:</h4>
                    <p>info@example.com</p>
                  </div>
                  <div className="phone">
                    <i className="bi bi-phone"></i>
                    <h4>Call:</h4>
                    <p>+1 5589 55488 55</p>
                  </div>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d12097.433213460943!2d-74.0062269!3d40.7101282!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xb89d1fe6bc499443!2sDowntown+Conference+Center!5e0!3m2!1smk!2sbg!4v1539943755621"
                    frameBorder="0"
                    style={{ border: 0, width: "100%", height: "290px" }}
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
              <div className="col-lg-7 mt-5 mt-lg-0 d-flex align-items-stretch text-start">
                <form
                  onSubmit={handleSubmit}
                  className="php-email-form w-100"
                >
                  <div className="row">
                    <div className="form-group col-md-6">
                      <label htmlFor="Name">
                        Your Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="Name"
                        className={`form-control ${errors.Name ? "is-invalid" : ""}`}
                        id="Name"
                        value={formData.Name}
                        onChange={handleChange}
                        maxLength={50}
                      />
                      {errors.Name && (
                        <div className="invalid-feedback">{errors.Name}</div>
                      )}
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="Email">
                        Your Email <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="Email"
                        className={`form-control ${errors.Email ? "is-invalid" : ""}`}
                        id="Email"
                        value={formData.Email}
                        onChange={handleChange}
                      />
                      {errors.Email && (
                        <div className="invalid-feedback">{errors.Email}</div>
                      )}
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="Subject">
                      Subject <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.Subject ? "is-invalid" : ""}`}
                      name="Subject"
                      id="Subject"
                      value={formData.Subject}
                      onChange={handleChange}
                    />
                    {errors.Subject && (
                      <div className="invalid-feedback">{errors.Subject}</div>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="Message">
                      Message <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className={`form-control ${errors.Message ? "is-invalid" : ""}`}
                      name="Message"
                      rows="11"
                      value={formData.Message}
                      onChange={handleChange}
                    
                    ></textarea>
                    {errors.Message && (
                      <div className="invalid-feedback">{errors.Message}</div>
                    )}
                  </div>
                  <div className="my-3">
                    <div className="loading">{isLoading ? "Sending..." : "Sending..."}  </div>
                    <div className="error-message"></div>
                    <div className="sent-message">
                      Your message has been sent. Thank you!
                    </div>
                  </div>
                  <div className="text-center mt-2">
                    <CustomButtonGreen
                      text={isLoading ? "Sending..." : "Contact Us"}
                    
                      type="submit"
                      disabled={isLoading}
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ======= Footer ======= */}

      <div id="preloader"></div>
      <a
        href="#"
        className="back-to-top d-flex align-items-center justify-content-center"
      >
        <i className="bi bi-arrow-up-short"></i>
      </a>
    </>
  );
}

export default Branding;
