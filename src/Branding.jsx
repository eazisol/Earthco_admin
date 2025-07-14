import React, { useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  CustomButton,
  CustomButtonGreen,
  CustomButtonRec,
} from "./components/CustomButton";
import { useNavigate } from "react-router";
import HeroSection from './components/HeroSection';
function Branding() {
  let navigate = useNavigate();
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
                  Welcome to EarthCo Landscape, where we transform outdoor
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
                At EarthCo Landscape, we offer comprehensive landscaping
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
        <section id="cta" className="cta">
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
                value — whether you're upgrading your outdoor space or need
                regular maintenance.
              </p>
            </div>

            <div className="row">
              <div
                className="col-lg-4 text-start"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <div className="box">
                  <h3>Free Plan</h3>
                  <h4>
                    <sup>$</sup>0<span className="per-month">per month</span>
                  </h4>
                  <ul>
                    <li>
                      <i className="bx bx-check"></i> Quam adipiscing vitae
                      proin
                    </li>
                    <li>
                      <i className="bx bx-check"></i> Nec feugiat nisl pretium
                    </li>
                    <li>
                      <i className="bx bx-check"></i> Nulla at volutpat diam
                      uteera
                    </li>
                    <li className="na">
                      <i className="bx bx-x"></i>{" "}
                      <span>Pharetra massa massa ultricies</span>
                    </li>
                    <li className="na">
                      <i className="bx bx-x"></i>{" "}
                      <span>Massa ultricies mi quis hendrerit</span>
                    </li>
                  </ul>
                  <CustomButton onClick={()=> navigate("/register")}/>
                </div>
              </div>

              <div
                className="col-lg-4 mt-4 mt-lg-0 text-start"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <div className="box featured">
                  <h3>Business Plan</h3>
                  <h4>
                    <sup>$</sup>29<span className="per-month">per month</span>
                  </h4>
                  <ul>
                    <li>
                      <i className="bx bx-check"></i> Quam adipiscing vitae
                      proin
                    </li>
                    <li>
                      <i className="bx bx-check"></i> Nec feugiat nisl pretium
                    </li>
                    <li>
                      <i className="bx bx-check"></i> Nulla at volutpat diam
                      uteera
                    </li>
                    <li>
                      <i className="bx bx-check"></i> Pharetra massa massa
                      ultricies
                    </li>
                    <li>
                      <i className="bx bx-check"></i> Massa ultricies mi quis
                      hendrerit
                    </li>
                  </ul>
                  <CustomButtonGreen  onClick={()=> navigate("/register")}/>
                </div>
              </div>

              <div
                className="col-lg-4 mt-4 mt-lg-0 text-start"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <div className="box">
                  <h3>Developer Plan</h3>
                  <h4>
                    <sup>$</sup>49<span className="per-month">per month</span>
                  </h4>
                  <ul>
                    <li>
                      <i className="bx bx-check"></i> Quam adipiscing vitae
                      proin
                    </li>
                    <li>
                      <i className="bx bx-check"></i> Nec feugiat nisl pretium
                    </li>
                    <li>
                      <i className="bx bx-check"></i> Nulla at volutpat diam
                      uteera
                    </li>
                    <li>
                      <i className="bx bx-check"></i> Pharetra massa massa
                      ultricies
                    </li>
                    <li>
                      <i className="bx bx-check"></i> Massa ultricies mi quis
                      hendrerit
                    </li>
                  </ul>
               
                  <CustomButton  onClick={()=> navigate("/register")}/>
                </div>
              </div>
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
                  action="forms/contact.php"
                  method="post"
                  role="form"
                  className="php-email-form"
                >
                  <div className="row">
                    <div className="form-group col-md-6">
                      <label htmlFor="name">Your Name</label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        id="name"
                        required
                      />
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="email">Your Email</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        id="email"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <input
                      type="text"
                      className="form-control"
                      name="subject"
                      id="subject"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea
                      className="form-control"
                      name="message"
                      rows="10"
                      required
                    ></textarea>
                  </div>
                  <div className="my-3">
                    <div className="loading">Loading</div>
                    <div className="error-message"></div>
                    <div className="sent-message">
                      Your message has been sent. Thank you!
                    </div>
                  </div>
                  <div className="text-center">
                    <CustomButtonGreen text="Send Message" type="submit" />
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
