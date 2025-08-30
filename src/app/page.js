 

import Home from "@/app/lib/utilityCom/Home"
import Hero from "@/app/lib/utilityCom/Hero"

export default function Page(){
   
    
 
    return(
       <div>
            

            <div className=" bg-slate-700 py-10 md:px-5 flex justify-center items-center ">
                <div className=" md:container m-auto shadow-xl md:p-10  p-2">
                  <Home/>
                  <div>
                        <Hero/>
                  </div>
    
                </div>
            </div>
            

       </div>

    )
}