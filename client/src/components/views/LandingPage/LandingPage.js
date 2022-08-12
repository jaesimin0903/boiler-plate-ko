import React ,{useEffect} from 'react'
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
import Auth from '../../../hoc/auth'
function LandingPage() {
  const navigate = useNavigate();
  useEffect(()=>{
    
    axios.get("/api/hello")
    .then(function(res){
      console.log(res.data)
      
    })
    .catch((e) =>{
      //console.log(e.body)
    })
    
    // axios({
    //   method : "get",
    //   url :'/api/hello',
    //   // proxy:{
    //   //   host:'localhost:5000',
    //   //   port:5000
    //   // }
    // }).then((res) => console.log(res.data))
    
    
  },[ ])

  const onClickHandler = () =>{
    axios.get("/api/users/logout")
    .then(response => {
      if(response.data.success){
        navigate('/login')
      }else{
        alert('logout failed')
      }
    })
  }

  return (
    <div style={({
      display:'flex', justifyContent:'center', alignItems:'center',
      width:"100%", height:'100vh'
    })}>
        <h2>시작 페이지</h2>

        <button onClick={onClickHandler}>
          LOGOUT
        </button>
    </div>
  )
}

export default Auth(LandingPage,null)