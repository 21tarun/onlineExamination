import React from 'react'
import {Link} from 'react-router-dom'
import './quetion.css'
import {Button ,Modal} from 'react-bootstrap'
import { useNavigate } from "react-router-dom";

function Quetions() {
    const [data,setData]=React.useState([])
    const [login,setLogin]=React.useState(true)
    const [type,setType]=React.useState(true)
    const [show1,setShow1]=React.useState(false)
    const [show2,setShow2]=React.useState(false)


    const [quetion,setQuetion]=React.useState("")
    const [option1,setOption1]=React.useState("")
    const [option2,setOption2]=React.useState("")
    const [option3,setOption3]=React.useState("")
    const [option4,setOption4]=React.useState("")
    const [answer,setAnswer]=React.useState("")
    const [file,setFile]=React.useState(null)

    

    const navigate =useNavigate()






    
    let token
    let userType
    if(!localStorage.getItem('login')) token=""
    if(localStorage.getItem('login')){
        token=JSON.parse(localStorage.getItem('login')).token
        userType=JSON.parse(localStorage.getItem('login')).type
    }
    

    function addStudent(){
        if(!quetion) return alert("quetion mandatory")
        if(!option1 || !option2 || !option3 || !option4)return alert("all 4 option are mandatory to add quetion")
        if(!answer) alert("answer required")

        const data = new FormData();
        data.append('file',file)
        data.append('quetion',quetion)
        data.append('option1',option1)
        data.append('option2',option2)
        data.append('option3',option3)
        data.append('option4',option4)
        data.append('answer',answer)







        fetch("http://localhost:4000/createQuetion",{
                method:'POST',
                headers:{
                    // 'Content-type': 'multipart/form-data',
                    // 'Accept':"application/json",
                    // 'Content-type': 'application/json',
                    
                    
                    'x-api-key':token

                },
                body: data
                // files:[fileImage]
                
                
            }).then((result)=>result.json())
                .then((res)=>{
                    // console.log(res)
                    if(res.status==true) {
                        setShow1(false)
                        window.location.reload(true)
                    }
                    if(res.msg=='Authentication token is missing' || res.err=='jwt expired'){
                        navigate('/signIn')
                    }
                    else{
                        alert(res.message)
                    }

                })

    }

    React.useEffect(()=>{
        fetch("http://localhost:4000/getQuetions",{
            headers:{

                'x-api-key':token
            }
        })
        .then((result)=>result.json())
        .then(res=>{
            console.log(res)
            setData(res.data)
            if(res && res.data) {
                setLogin(true)
                if(res.message=='all quetions')setType(false)
            }    
            if(!res.data)setLogin(false)
            
        })

   },[] )
  return (
    <div className='quetions'>
    <h1>Quetions</h1>
    
    {
        
        login?
            
                type?
                    <div className='studentQ'>
                        {
                            data.map((x)=>
                
                                <div className='quetion'>
                                    
                                    
                                    
                                    
                                    <h3>{x.quetion}</h3><br/>
                                
                                    <p><b>1.</b> {x.options[0]}</p><br/>
                                    <p><b>2.</b> {x.options[1]}</p><br/>
                                    <p><b>3.</b> {x.options[2]}</p><br/>
                                    <p><b>4.</b> {x.options[3]}</p><br/>

                                    <a href={x.file}>supportive file</a><br/><br/>

                                    <label for="psw"><b>Answer</b></label>
                                    <select name="userType" id="userType" >
                                        <option value="">Correct Answer..</option>
                                        <option value="Student">{x.answer}</option>
                                        
                                        
                                    </select>
                
                
                                </div>
                
                            )
                        }
                    </div> :

                    <div className='AdminQ'>
                        <button type="button" onClick={()=>setShow1(true)} >Add Quetion</button>
                        <Modal show={show1} style={{marginLeft:500, marginRight:500}} >
                                    <Modal.Header>Add Quetion</Modal.Header>
                                        <Modal.Body>
                                            <textarea  type="text" onChange={(e)=>{setQuetion(e.target.value)}} placeholder="Quetion"/><br/><br/>
                                            <input type="text" onChange={(e)=>{setOption1(e.target.value)}} placeholder="option1"/><br/>
                                            <input type="text" onChange={(e)=>{setOption2(e.target.value)}} placeholder="option2"/><br/>                                           
                                            <input type="text" onChange={(e)=>{setOption3(e.target.value)}} placeholder="option3"/><br/>
                                            <input type="text" onChange={(e)=>{setOption4(e.target.value)}} placeholder="option4"/><br/>
                                            <input type="text" onChange={(e)=>{setAnswer(e.target.value)}} placeholder="answer"/><br/>

                                            <label>supportive file for quetion</label><br/>
                                            <input type="file" id="myFile" name="filename" onChange={(e)=>setFile(e.target.files[0])}/>

                                            
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button onClick={addStudent}>Add</Button>
                                            <Button onClick={()=>setShow1(false)}>close</Button>
                                        </Modal.Footer>
                        </Modal>
                    {
                        
                        data.map((x)=>
                            
                            <div className='quetion'>
                                
                                
                                
                                
                                <h3>{x.quetion}</h3><br/>
                            
                                <p><b>1.</b> {x.options[0]}</p>
                                <p><b>2.</b> {x.options[1]}</p>
                                <p><b>3.</b> {x.options[2]}</p>
                                <p><b>4.</b> {x.options[3]}</p>

                                <p>Id: {x._id}</p>
                                <button type="button" onClick={()=>setShow2(true)}>edit</button>




                            </div>

                        )
                        
                    }
                    </div>

                    
            
        
 
        
        :
        <div>
            <h3>you need to login the account</h3>
            <h2><Link to='/signIn'>signIn</Link></h2>
        </div>

    }


</div>
  )
}

export default Quetions