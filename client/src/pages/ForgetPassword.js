import React, { useState } from 'react'
import axios from '../services/axiosInterceptor'
const ForgetPassword = () => {
  const[email,setEmail] = useState('');

  const handleInput=(e)=>{
    setEmail(e.target.value)
  }
  
  const handleSubmit=async(e)=>{
    e.preventDefault();
    try{
    const response = await axios.post('api/auth/forget-password',{email})
    if(response.status===200){
      alert("email sent")
    }
    else{
      alert("something went wrong")  
    }
  }
  catch(error){
    console.log("Error" ,error)
    alert("failed to send mail")
  }
  }

  return (
    <>
        <section className="vh-100" style={{ backgroundColor: "#9A616D" }}>
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col col-xl-10">
            <div className="card" style={{ borderRadius: "1rem" }}>
              <div className="row g-0">
                <div className="col-md-6 col-lg-5 d-none d-md-block">
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp"
                    alt="login form"
                    className="img-fluid"
                    style={{ borderRadius: "1rem 0 0 1rem" }}
                  />
                </div>
                <div className="col-md-6 col-lg-7 d-flex align-items-center">
                  <div className="card-body p-4 p-lg-5 text-black">
                    <form onSubmit={handleSubmit}>
                      <div className="d-flex align-items-center mb-3 pb-1">
                        <i
                          className="fas fa-cubes fa-2x me-3"
                          style={{ color: " #ff6219" }}
                        ></i>
                        <span className="h1 fw-bold mb-0">Forget Password</span>
                      </div>
                      <h5
                        className="fw-normal mb-3 pb-3"
                        style={{ letterSpacing: "1px" }}
                      >
                        Type your email here
                      </h5>
                      <p>We will send password set-up link to your email</p>
                      <div className="form-outline mb-4">
                        <input
                          type="email"
                          id="emailInput"
                          placeholder="Enter Email"
                          className="form-control form-control-lg"
                          name="email"
                          value={email}
                          onChange={handleInput}
                          autoComplete='off'
                        />
                      </div>
                     
                      <div className="pt-1 mb-4">
                        <button
                          className="btn btn-dark btn-lg btn-block"
                          type="submit"
                        >
                          Send Email
                        </button>
                      </div>
                      
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  )
}

export default ForgetPassword
