
import React, { useState } from 'react';
import {useSelector} from "react-redux";
import {getStorage,ref,uploadBytesResumable,getDownloadURL} from "firebase/storage";
import {app} from "../Firebase"
import {useNavigate,useParams} from "react-router-dom";
import { useEffect } from 'react';
export default function UpdateListing() {
  const navigate=useNavigate();
  const params=useParams();
  const {currentUser}=useSelector(state=>state.user);
  const [formData, setFormData] = useState({ imageUrl: [],
  name:'',description:'',address:'',type:'rent',bedrooms:1,bathrooms:1,regularPrice:0,discountPrice:0,offer:false,parking:false,furnished:false});
  const [error,setError]=useState();
  const [loading,setLoading]=useState();
  const [ImageUploadError,setImageUploadError]=useState(null);
 const [files,setFiles]=useState([]);
console.log(formData.imageUrl);
console.log(formData);
const handleImageSubmit = async (e) => {
  e.preventDefault();
  if (files.length > 0 && files.length + formData.imageUrl.length < 7) {
    try {
      const urls = await Promise.all(files.map(storeImage));
      setFormData({ ...formData, imageUrl: formData.imageUrl.concat(urls) });
      setImageUploadError(null);
    } catch (err) {
      setImageUploadError('Image upload failed (2mb max per image)');
    }
  } else {
    setImageUploadError('You can only upload 6 images per listing');
  }
};
const storeImage=async(file)=>{
  return new Promise((resolve,reject)=>{
    const storage=getStorage(app);
    const fileName=new Date().getTime()+file.name;
    const storageRef=ref(storage,fileName);
    const uploadTask=uploadBytesResumable(storageRef,file);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`upload is ${progress}% done`);
      },
      (error) => {
        console.error('Error during upload:', error);
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            console.log('Download URL:', downloadURL);
            resolve(downloadURL);
          })
          .catch((urlError) => {
            console.error('Error getting download URL:', urlError);
            reject(urlError);
          });
      }
    );
  });
};
const handleRemoveImage=(index)=>{
  setFormData({...formData,imageUrl:formData.imageUrl.filter((image,i)=>i!==index)});
}
const handleChange=(e)=>{
  if(e.target.id==='sale'||e.target.id==='rent')
  {
    setFormData({...formData,type:e.target.id});
  }
  if(e.target.id==='parking'||e.target.id==='furnished'||e.target.id==='offer')
  {
    setFormData({...formData,[e.target.id]:e.target.checked});
  }
  if(e.target.type=='text'||e.target.type==='number'||e.target.type === 'textarea')
  { 
    setFormData({...formData,[e.target.id]:e.target.value});
  }
}
const handleSubmit=async(e)=>{
  e.preventDefault();
  try{
   
    if(+formData.regularPrice< +formData.discountPrice)
    return setError("Discount price must be lower than regular price");
    setError(false);
    setLoading(true);
    const res=await fetch(`/api/listing/update/${params.id}`,{
       method:'PATCH',
       headers:{
        'Content-Type':'application/json',
       },
       body:JSON.stringify({...formData,userRef:currentUser._id}),
    })
const data=await res.json();
navigate(`/listing/${data._id}`);
if(data.status==='failed')
{
  setError(data.message);
  setLoading(false);
}
  }
  catch(err)
  {
    setError(err.message);
    setLoading(false);

  }
}
useEffect(()=>{
    const fetchListing=async ()=>{
    const listingId=params.id;
    const res=await fetch(`/api/listing/get/${listingId}`);
    const data=await res.json();
    console.log(data)
  if(data.status==='failed')
  {
    setError(data.message);
    return;
  }
  setFormData(data);
   
    }
  fetchListing();
},[])
  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Update a Listing</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 sm:flex-row'>
      <div className='flex flex-col gap-4 flex-1'>
      <input type='text' placeholder='Name' className='border p-3 rounded-lg' id="name" maxLength='62' minLength='10' required onChange={handleChange} value={formData.name} />
      <textarea type='text' placeholder='Description' className='border p-3 rounded-lg' id="description" maxLength='62' minLength='10' required onChange={handleChange} value={formData.description} />
      <input type='text' placeholder='Address' className='border p-3 rounded-lg' id="address" maxLength='62' minLength='10' required  onChange={handleChange} value={formData.address}/>
   
     <div className='flex gap-6 flex-wrap'>
      <div className='flex gap-2'>
        <input type='checkbox' id='sale' className='w-3'  onChange={handleChange} checked={formData.type==='sale'}/>
        <span>Sell</span>
      </div>
      <div className='flex gap-2'>
        <input type='checkbox' id='rent' className='w-3' onChange={handleChange} checked={formData.type==='rent'}   />
        <span>Rent</span>
      </div>
      <div className='flex gap-2'>
        <input type='checkbox' id='parking' className='w-3' onChange={handleChange} checked={formData.parking}  />
        <span>Parking Spot</span>
      </div>
      <div className='flex gap-2'>
        <input type='checkbox' id='furnished' className='w-3' onChange={handleChange} checked={formData.furnished} />
        <span>Furnished</span>
      </div>
      <div className='flex gap-2'>
        <input type='checkbox' id='offer' className='w-3' onChange={handleChange} checked={formData.offer} />
        <span>Offer</span>
      </div>
     </div>
     <div className='flex flex-wrap gap-6'>
      <div className='flex items-center gap-2'>
        <input type='Number' id="bedrooms" min='1' max='10' required className='p-3 border-gray-100 rounded-lg' onChange={handleChange} value={formData.bedrooms} />
         <p>Beds</p>
      </div>
      <div className='flex items-center gap-2'>
        <input type='Number' id="bathrooms" min='1' max='10' required className='p-3 border-gray-100 rounded-lg' onChange={handleChange} value={formData.bathrooms} />
         <p>Bath</p>
      </div>
      <div className='flex items-center gap-2'>
        <input type='Number' id="regularPrice" min='50' max='10000000' required className='p-3 border-gray-100 rounded-lg' onChange={handleChange} value={formData.regularPrice} />
         <div>
          <p>Regular Price</p>
          <span>$ / month</span>
         </div>
      </div>
      {formData.offer&&<div className='flex items-center gap-2'>
        <input type='Number' id="discountPrice"  min='50' max='10000000' required className='p-3 border-gray-100 rounded-lg' onChange={handleChange} value={formData.discountPrice} />
        <div className='flex flex-col items-center'>
        <p>Discounted price</p>
        <span>$ / month</span>
        </div>
      </div>}
      </div>
     </div>
        <div className='flex flex-col flex-1 gap-4'>
          <p className='font-semibold'>
            Images:
            <span className='font-normal text-grey-600 ml-2'>
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className='flex gap-4'>
            <input
              onChange={(e) => setFiles(e.target.files)}
              className='p-3 border border-gray-300 rounded w-full'
              type='file'
              id='images'
              accept='image/*'
              multiple
            />
            <button
              type='submit'
              className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
              onClick={handleImageSubmit}
            >
              Upload
            </button>
          </div>
          {
            formData?.imageUrl?.length > 0 &&
            formData?.imageUrl.map((url, index) => (
              <div className='flex justify-between p-3 border items-center' >
              <img key={index} src={url} alt={`listing image ${index}`} className='w-40 h-40 object-cover rounded-lg' />
              <button type="button"  className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75' onClick={()=>{handleRemoveImage(index)}}>Delete</button>
              </div>
            ))}
          {/* <p className='text-red-700 text-sm'>{ImageUploadError && ImageUploadError}</p> */}
          <button disabled={loading} className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
           {loading? 'Updating...':" Update Listing"}
          </button>
          {error && <p className='text-red-700 text-sm'>{error}</p>}
        </div>
      </form>
    </main>
  );
}