import React from 'react'
import './Login.css'
import { useNavigate , Link } from "react-router-dom";

function Login() {
    let [email,setEmail]= React.useState("")
  
    let [userType,setUserType]= React.useState("")
    let [login,setLogin]=React.useState(false)

    const navigate =useNavigate()
    

    function Login(){
        if(!email) return alert("email is required")
 
        if(!userType) return alert("userType is required")
        

        else{
            let data={email,userType}
            fetch("http://localhost:4000/login",{
                method:'POST',
                headers:{
                    'Content-type': 'application/json',

                },
                body: JSON.stringify(data)
                
            }).then((result)=>result.json())
            .then((res)=>{
                console.log(res)
                if(res.status==true){
                    localStorage.setItem('login',JSON.stringify({
                        login:true,
                        token:res.token,
                        userType:res.type
                    }))
                    setLogin(true)
                }
                if(res.status==false){
                    return alert(res.message)
                }
        

                
            })
        }
    }
  return (
    <>
        {
            !login?
            <div className='login'>
                <div class="imgcontainer">
                    <img src="https://t3.ftcdn.net/jpg/01/18/01/98/360_F_118019822_6CKXP6rXmVhDOzbXZlLqEM2ya4HhYzSV.jpg" alt="Avatar" class="avatar"/>
                </div>
  
                <div class="container">
                    <label for="uname"><b>Email</b></label>
                    <input type="email" placeholder="Enter Username" onChange={(e)=>{setEmail(e.target.value)}} required/>
        

                    <label for="psw"><b>UserType</b></label>
                    <select name="userType" id="userType" onChange={(e)=>{setUserType(e.target.value)}} required >
                        <option value="">choose type</option>
                        <option value="Student">Student</option>
                        <option value="Admin">Admin</option>
                        
                    </select>
                        
                    <button type="submit" onClick={Login}>Login</button>
  
                </div>
  
  
            </div> : navigate('/quetions')

        }
    </>
  )
}

export default Login