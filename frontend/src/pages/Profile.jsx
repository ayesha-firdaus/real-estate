import React, { useState,useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useRef } from 'react';
import {getDownloadURL, getStorage, uploadBytesResumable}  from "firebase/storage";
import { app } from '../Firebase';
import { ref } from 'firebase/storage';
import {updateUserStart,updateUserSuccess,updateUserFailure,deleteUserStart,deleteUserSuccess,deleteUserFailure,SignoutStart,SignoutSuccess,SignoutFailure} from "../redux/user/userSlice.js"
import {useDispatch} from "react-redux";
import {Link} from "react-router-dom";
export default function Profile() {
  const fileRef=useRef(null);
  const [file,setfile]=useState(undefined);
  const [filePerc,setfilePrec]=useState(0);
  const [fileError,setfileError]=useState(false);
  const [FormData,setFormData]=useState({});
  const dispatch=useDispatch();
  const [showListingError,setShowListingError]=useState(false);
  const {currentUser}=useSelector((state)=>state.user);
  const [userListing,setuserListing]=useState([]);
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
 const handleChange=(e)=>{
  e.preventDefault();
  setFormData({...FormData,[e.target.id]:e.target.value})
 }

 const handleDeleteUser=async()=>{
  try{
    dispatch(deleteUserStart());
    const res=await fetch(`/api/user/delete/${currentUser._id}`,{
      method:'DELETE',
     })
     const data=await res.json();
     if(data.status==='failed'){
      dispatch(deleteUserFailure(data.message))
      return;
     }
  dispatch(deleteUserSuccess());
  }
  catch(error){
  dispatch(deleteUserFailure(error.message));
  }
 }

 const handleSignOut=async()=>{
  SignoutStart();
  try{
const res=await fetch("/api/auth/signout");
const data=await res.json();
if(data.status===false)
{
   return dispatch(SignoutFailure(data.message));
}
dispatch(SignoutSuccess());
  }
catch(error)
  {
    return dispatch(SignoutFailure(error.message));
  }
}

 const handleSubmit=async(e)=>{
  e.preventDefault();
  try{
    dispatch(updateUserStart())
  const response=await fetch(`/api/user/update/${currentUser._id}`,{
    method:'POST',
    headers:{
      'Content-Type':"application/json",
    },
    body:JSON.stringify(FormData),
  });
  const data=await response.json();
  if(data.status==="failed")
  {
    console.log(data)
    dispatch(updateUserFailure(data.message));
    return;
  }
   dispatch(updateUserSuccess(data));
  }
  catch(error){
    console.log(error.message)
    dispatch(updateUserFailure(error.message));
  }
 }

  useEffect(()=>{
    if(file)
    {
      handleFileUpload();
    }
  },[file])
const handleShowlisting=async()=>{
  try{
    setShowListingError(false);
   const res=await fetch(`/api/user/listings/${currentUser._id}`);
   const data=await res.json();
   console.log(data);
   if(data.status==="failed")
   {
    setShowListingError(true);
    return;
   }
  setuserListing(data)

  }
  catch(err){
   setShowListingError(err);
  }
}
console.log(userListing)
const handleListingDelete=async(id)=>{
  console.log(id);
  try{
    
    const res=await fetch(`api/listing/delete/${id}`,{
      method:"DELETE",

    });
    const data=await res.json();
  

    if(data.status==="failed")
    {
  
      return 
    }


  setuserListing((prev)=>prev.filter((listing)=>listing._id!==id));
}catch(err)
  {
    console.log(err)
  }
}
  return (
    <div className='p-3 max-w-lg mx-auto'>
  <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
  <form className='flex flex-col gap-4'  onClick={handleSubmit}>
  <input onChange={(e)=>setfile(e.target.files[0])} type='file' ref={fileRef} hidden accept='image/*'/>
  <img onClick={()=>fileRef.current.click()}  src={FormData.avatar||currentUser.avatar} alt='profile' className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'  />
  <p className='text-sm self-center'>{fileError?<span className='text-red-700'>Error in Image Upload</span>:filePerc>0 && filePerc<100?(<span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>):filePerc===100?<span className='text-green-700'>Image Uploaded SucessFully</span>:''}</p>
    <input  type="text" placeholder='username'  defaultValue={currentUser.username} className='border p-3 rounded-lg' id="username"   onChange={handleChange} />
    <input type="text" placeholder='email' defaultValue={currentUser.email}  className='border p-3 rounded-lg' id='email'  onChange={handleChange} />
    <input type="text" placeholder='password'  className='border p-3 rounded-lg' id='password' onChange={handleChange}/>
  <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>update</button>
  <Link to={"\create-listing"} className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95'>
    Create Listing
  </Link>
</form>
<div className='flex justify-between mt-5'>
  <span className='text-red-700 cursor-pointer' onClick={handleDeleteUser}>Delete Account</span>
  <span className='text-red-700 cursor-pointer' onClick={handleSignOut}>Sign Out</span>
</div>
<button onClick={handleShowlisting} className='text-green-700 w-full'>Show listing</button>
<p className='text-red-700 mt-5'>{showListingError?'Error showing listing':''}</p>
{userListing.length>0&&<div className='flex flex-col gap-4'>
<h1 className='text-center my-7 text-2xl font'>
  Your Listing
</h1>
{userListing?.map((listing)=>{
  return (<div key={listing._id} className='border rounded-lg p-3 flex justify-between items-center gap-4'>
     <Link to={`/listing/${listing._id}`}><img src={listing.image} alt={listing.name} className='h-16 w-16 object-contain rounded-lg' /></Link>
     <Link to={`/listing/${listing._id}`} className='flex-1'><p className='text-slate-700 font-semibold flex-1 hover:underline truncate'>{listing.title}</p></Link>
      <div className='flex flex-col items-center'>
      <button onClick={()=>handleListingDelete(listing._id)} className='text-red-700 uppercase'>Delete</button>
      <Link to={`/update-listing/${listing._id}`}>
      <button className='text-green-700 uppercase'>Edit</button>
      </Link>
      </div>
  </div>
  )

})}
    </div>}
    </div>
  )
}

