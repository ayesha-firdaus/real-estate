import React from 'react'
import { useState,useEffect } from 'react'
import {Link} from "react-router-dom";
export default function Contact({list}) {
  const [landlord,setlandlord]=useState(null);
  const [message,setmessage]=useState("");
  useEffect(()=>{
    const fetchLandLord=async()=>{
      try{
        const res=await fetch(`/api/user/${list.userRef}`);
        const data=await res.json();
        setlandlord(data);
      }
      catch(error)
      {
        console.log(error);
      }
    }
    fetchLandLord();
  },[list.userRef])
  const onChange=(e)=>{
    setmessage(e.target.value);
  }
  console.log(list)
  return (
  <>
    {landlord&&(<div className='flex flex-col gap-2'>
      <p>Contact <span className='font-semibold'>{landlord.title}</span>
      for<span className='font-semibold'>{list.name.toLowerCase()}</span></p>
      <textarea name='message'id='message' rows="2" value={message} onChange={onChange} placeholder='Enter your message here...' className='w-full border p-3 rounded-lg'></textarea>
      <Link to={`mailto:${landlord.email}?subject=Regarding ${list.name}&body=${message}`}
      className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'>Send Message</Link>
    </div>)}
  </>
  )
}
