import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  CustomButton,
  CustomButtonGreen,
  CustomButtonRec,
} from "./components/CustomButton";
import { useNavigate } from "react-router";
import HeroSection from "./components/HeroSection";
const pricingPlans = [
  {
    name: "Basic",
    price: 15,
    priceId:'prod_SgRIbITKi179cC',
    features: [
      { label: "1 Company Account", available: true },
      { label: "1 QuickBooks Integration", available: true },
      { label: "Access to Core Features", available: true },
      { label: "Multi-Company Dashboard", available: false },
      { label: "Advanced Reporting Tools", available: false },
    ],
    buttonComponent: "CustomButton",
    delay: 100,
  },
  {
    name: "Standard", 
    price: 29,
    features: [
      { label: "3 Company Accounts", available: true },
      { label: "3 QuickBooks Integrations", available: true },
      { label: "Access to All Core Features", available: true },
      { label: "Multi-Company Dashboard", available: true },
      { label: "Priority Support", available: false },
    ],
    featured: true,
    buttonComponent: "CustomButtonGreen",
    delay: 200,
    priceId:'prod_SgRIbITKi179cC',
  },
  {
    name: "Premium",
    price: 49,
    priceId:'prod_SgRIbITKi179cC',
    features: [
      { label: "5 Company Accounts", available: true },
      { label: "5 QuickBooks Integrations", available: true },
      { label: "All Features from Standard", available: true },
      { label: "Advanced Reporting Tools", available: true },
      { label: "Priority Support", available: true },
    ],
    buttonComponent: "CustomButton",
    delay: 300,
  },
];

function Branding() {
  let navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters long";
    } else if (formData.name.trim().length >= 50) {
      newErrors.name = "Name cannot exceed 50 characters";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Subject validation
    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
  };
const handleSubscription=(priceId)=>{
 navigate("/register")
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
     
<section id="pricing" className="pricing">
  <div className="container" data-aos="fade-up">
    <div className="section-title">
      <h2>Pricing</h2>
      <p>
        At Earthco, we believe in honest pricing with no hidden fees.
        Our flexible service packages are designed to give you the best
        value — whether you're managing a single business or multiple
        operations through QuickBooks.
      </p>
    </div>

    <div className="row">
      {pricingPlans.map((plan, index) => {
        const ButtonComponent = plan.buttonComponent === "CustomButtonGreen" ? CustomButtonGreen : CustomButton;
        return (
          <div
            key={plan.name}
            className={`col-lg-4 mt-4 mt-lg-0 text-start`}
            data-aos="fade-up"
            data-aos-delay={plan.delay}
          >
            <div className={`box ${plan.featured ? "featured" : ""}`}>
              <h3>{plan.name}</h3>
              <h4>
                <sup>$</sup>
                {plan.price}
                <span className="per-month">per month</span>
              </h4>
              <ul>
                {plan.features.map((feature, i) => (
                  <li key={i} className={feature.available ? "" : "na"}>
                    <i className={`bx ${feature.available ? "bx-check" : "bx-x"}`}></i>{" "}
                    <span>{feature.label}</span>
                  </li>
                ))}
              </ul>
              <ButtonComponent onClick={()=>handleSubscription(plan.priceId)} />
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
                <div className="info text-start">
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
                  className="php-email-form"
                >
                  <div className="row">
                    <div className="form-group col-md-6">
                      <label htmlFor="name">
                        Your Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        className={`form-control ${errors.name ? "is-invalid" : ""}`}
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        maxLength={50}
                      />
                      {errors.name && (
                        <div className="invalid-feedback">{errors.name}</div>
                      )}
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="email">
                        Your Email <span className="text-danger">*</span>
                      </label>
                      <input
                        type="test"
                        name="email"
                        className={`form-control ${errors.email ? "is-invalid" : ""}`}
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email address"
                      />
                      {errors.email && (
                        <div className="invalid-feedback">{errors.email}</div>
                      )}
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="subject">
                      Subject <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.subject ? "is-invalid" : ""}`}
                      name="subject"
                      id="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Enter subject"
                    />
                    {errors.subject && (
                      <div className="invalid-feedback">{errors.subject}</div>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="message">
                      Message <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className={`form-control ${errors.message ? "is-invalid" : ""}`}
                      name="message"
                      rows="10"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Enter your message"
                    ></textarea>
                    {errors.message && (
                      <div className="invalid-feedback">{errors.message}</div>
                    )}
                  </div>
                  <div className="my-3">
                    <div className="loading">Loading</div>
                    <div className="error-message"></div>
                    <div className="sent-message">
                      Your message has been sent. Thank you!
                    </div>
                  </div>
                  <div className="text-center">
                    <CustomButtonGreen
                      text={isSubmitting ? "Creating Account..." : "Contact Us"}
                      type="submit"
                      disabled={isSubmitting}
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
