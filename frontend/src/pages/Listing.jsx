import React, { useState,useEffect } from 'react'
import { useParams } from 'react-router-dom';
import {Swiper,SwiperSlide} from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from 'swiper/modules';
import "swiper/css/bundle";
import { listAll } from 'firebase/storage';
import { FaBath, FaBed, FaMapMarkedAlt,FaParking,FaChair} from 'react-icons/fa';
export default function Listing() {
    SwiperCore.use(Navigation);
    const [list,setlist]=useState(null);
    const [error,setError]=useState(false);
    const [loading,setloading]=useState(true);
    const params=useParams();
    useEffect(()=>{
      
       
        const getlist=async function(){
        try{
        setloading(true);
       const res=await fetch(`/api/listing/get/${params.id}`);
       const data=await res.json();
       if(data.status==="failed")
       {
            setError(data.message);
            setloading(false);
       }
       setlist(data);
       console.log(data);
       setloading(false);
       setError(false);
        }
    catch(error){
        setError(true);
        console.log(error)
        setloading(false);
    }}
        getlist();
    },[params.id])
    console.log(list)
    console.log(error)
  return (
    <main>
        {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
        {error&& <p className='text-center my-7 text-2xl'>Something went wrong</p>}
        {list && !loading && !error &&
        <div className='flex gap-2 flex-col items-center '>
        <Swiper navigation>
            {list.imageUrls.map(url=><SwiperSlide key={url}>
             <div className='h-[550px]' style={{background:`url(${url}) center no-repeat`,backgroundSize:'cover'}}>
                
             </div>
            </SwiperSlide>)}
        </Swiper>
           {/* <div className='text-center text-3xl'><span className='text-slate-700 text-center font-semibold'>{list.name}</span>-<span>{list.regularPrice}</span></div> */}
           <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
            <p  className='text-2xl font-semibold>'>{list.name} - ${' '}{list.offer? list.discountPrice.toLocaleString('en-US'):list.regularPrice.toLocaleString('en-US')}</p>
           </div>
           <p className='flex items-center mt-6 gap-2 text-slate-600 my-2 text-sm'><FaMapMarkedAlt className='text-green-700' />{list.address}</p>
           <div className='flex gap-5'>
           <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
            {list.type === 'rent'? "For Rent":"For Sale"} </p>
           {list.offer && <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>${+list.regularPrice - +list.discountPrice}</p>}
           </div>
            <p className='text-slate-800'><span className='font-semibold text-black'> Description -</span>
           {list.description}</p>
           <ul className='text-green-900 font-semibold text-sm flex items-center gap-4 sm:gap-6 flex-wrap'>
            <li className='flex items-center gap-1 whitespace-nowrap'>
                <FaBed className='text-lg' />
                {list.bedrooms>1? `${list.bedrooms} beds`: `${list.bedrooms} bed`}
            </li>
            <li className='flex items-center gap-1 whitespace-nowrap'>
                <FaBath className='text-lg' />{list.bathrooms>1? `${list.bathrooms} baths`: `${list.bathrooms} bath`}
            </li>
            <li className='flex items-center gap-1 whitespace-nowrap'>
                <FaParking className='text-lg' />{list.parking? "Parking Spot": `No Parking`}
            </li>
            <li className='flex items-center gap-1 whitespace-nowrap'>
                <FaChair className='text-lg' />{list.furnished? "Furnished": `UnFurnished`}
            </li>

           </ul>
                </div>
        }
    </main>
  )
}
