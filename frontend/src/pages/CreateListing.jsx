
import React, { useState } from 'react';

export default function CreateListing() {
  const [formData, setFormData] = useState({ imageUrl: [] });
  const [showImg, setImg] = useState(false);
const [uploading,setUploading]=useState(false);


  const handleImageChange = (e) => {

    const files = e.target.files;

    if (files.length < 0 &&files.length+formData.imageUrl.length>7) {
      throw new Error("can only upload 7 images");
    }
      // Read the content of the selected files
      const promises = Array.from(files).map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();

          reader.onloadend = () => {
            resolve(reader.result);
          };

          reader.readAsDataURL(file);
        });
      });

      // Wait for all FileReader instances to finish reading
      Promise.all(promises).then((results) => {
        setFormData({ ...formData, imageUrl: formData.imageUrl.concat(results) });
      }).catch((err)=>{
        
        console.log(err)
      })
    
     
    }
 
  ;
  const handleRemoveImage=function(index){
    console.log(index)
    setFormData({...formData,imageUrl:formData.imageUrl.filter((_,image)=> image!==index)});
  }
  const handleUpload = () => {
    setImg((prevState)=>!prevState);
  };

  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing</h1>
      <form className='flex flex-col gap-4 sm:flex-row'>
      <div className='flex flex-col gap-4 flex-1'>
      <input type='text' placeholder='Name' className='border p-3 rounded-lg' id="name" maxLength='62' minLength='10' required />
      <textarea type='text' placeholder='Description' className='border p-3 rounded-lg' id="description" maxLength='62' minLength='10' required />
      <input type='text' placeholder='Address' className='border p-3 rounded-lg' id="address" maxLength='62' minLength='10' required />
   
     <div className='flex gap-6 flex-wrap'>
      <div className='flex gap-2'>
        <input type='checkbox' id='sale' className='w-3' />
        <span>Sell</span>
      </div>
      <div className='flex gap-2'>
        <input type='checkbox' id='sale' className='w-3' />
        <span>Rent</span>
      </div>
      <div className='flex gap-2'>
        <input type='checkbox' id='sale' className='w-3' />
        <span>Parking Spot</span>
      </div>
      <div className='flex gap-2'>
        <input type='checkbox' id='sale' className='w-3' />
        <span>Furnished</span>
      </div>
      <div className='flex gap-2'>
        <input type='checkbox' id='sale' className='w-3' />
        <span>Other</span>
      </div>
     </div>
     <div className='flex flex-wrap gap-6'>
      <div className='flex items-center gap-2'>
        <input type='Number' id="bedrooms" min='1' max='10' required className='p-3 border-gray-100 rounded-lg' />
         <p>Beds</p>
      </div>
      <div className='flex items-center gap-2'>
        <input type='Number' id="bathrooms" min='1' max='10' required className='p-3 border-gray-100 rounded-lg' />
         <p>Bath</p>
      </div>
      <div className='flex items-center gap-2'>
        <input type='Number' id="regularPrice" min='1' max='10' required className='p-3 border-gray-100 rounded-lg' />
         <div>
          <p>Regular Price</p>
          <span>$ / month</span>
         </div>
      </div>
      <div className='flex items-center gap-2'>
        <input type='Number' id="discounte" min='1' max='10' required className='p-3 border-gray-100 rounded-lg' />
        <div className='flex flex-col items-center'>
        <p>Discounted price</p>
        <span>$ / month</span>
        </div>
      </div>
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
              onChange={handleImageChange}
              className='p-3 border border-gray-300 rounded w-full'
              type='file'
              id='images'
              accept='image/*'
              multiple
            />
            <button
              onClick={handleUpload}
            
              type='button'
              className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
            >
             upload
            </button>
          </div>
          {showImg &&
            formData?.imageUrl?.length > 0 &&
            formData?.imageUrl.map((url, index) => (
              <div className='flex justify-between p-3 border items-center' >
              <img key={index} src={url} alt={`listing image ${index}`} className='w-40 h-40 object-cover rounded-lg' />
              <button type="button"  className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75' onClick={()=>{handleRemoveImage(index)}}>Delete</button>
              </div>
            ))}
          {/* <p className='text-red-700 text-sm'>{ImageUploadError && ImageUploadError}</p> */}
          <button className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}