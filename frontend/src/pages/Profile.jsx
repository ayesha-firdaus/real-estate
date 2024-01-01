import React, { useState,useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useRef } from 'react';
import {getDownloadURL, getStorage, uploadBytesResumable}  from "firebase/storage";
import { app } from '../Firebase';
import { ref } from 'firebase/storage';
export default function Profile() {
  const fileRef=useRef(null);
  const [file,setfile]=useState(undefined);
  const [filePerc,setfilePrec]=useState(0);
  const [fileError,setfileError]=useState(false);
  const [FormData,setFormData]=useState({});
  console.log(filePerc)
  console.log(file?.name);
  console.log(FormData)
  const {currentUser}=useSelector((state)=>state.user);
  const   handleFileUpload=()=>{
    const storage=getStorage(app);
    const d=new Date().getTime()
    const f=file?.name
    const fileName= d+f;

    const storageRef=ref(storage,fileName);
    const uploadTask=uploadBytesResumable(storageRef,file);
    uploadTask.on('state_changed',(snapshot)=>{
      const progress=(snapshot.bytesTransferred/snapshot.totalBytes)*100;
     setfilePrec(Math.round(progress));
    },
(error)=>{
  setfileError(true);
},
()=>{
  getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
    setFormData({...FormData,avatar:downloadURL})
  })
},

 ) }

  useEffect(()=>{
    if(file)
    {
      handleFileUpload();
    }
  },[file])
  return (
    <div className='p-3 max-w-lg mx-auto'>
  <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
  <form className='flex flex-col gap-4'>
  <input onChange={(e)=>setfile(e.target.files[0])} type='file' ref={fileRef} hidden accept='image/*'/>
  <img onClick={()=>fileRef.current.click()}  src={FormData.avatar||currentUser.avatar} alt='profile' className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'  />
  <p className='text-sm self-center'>{fileError?<span className='text-red-700'>Error in Image Upload</span>:filePerc>0 && filePerc<100?(<span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>):filePerc===100?<span className='text-green-700'>Image Uploaded SucessFully</span>:''}</p>
    <input  type="text" placeholder='username' className='border p-3 rounded-lg' id="username" />
    <input type="text" placeholder='email' className='border p-3 rounded-lg' id='email' />
    <input type="text" placeholder='password' className='border p-3 rounded-lg' id='password'/>
  <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>update</button>
</form>
<div className='flex justify-between mt-5'>
  <span className='text-red-700 cursor-pointer'>Delete Account</span>
  <span className='text-red-700 cursor-pointer'>Sign Out</span>
</div>
    </div>
  )
}
