import { DecodedJwtToken } from "@/app/lib/authFunction/JwtHelper"
import { connectToDB } from "@/app/lib/DbConnect"
import User from "@/app/models/User"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(req,res){
    try{
         await connectToDB()
         const storeCookies = await cookies()
         const token =await storeCookies.get('token')?.value
         if(!token){
            return NextResponse.json({status:"fail",msg:"something went wrong"})
         }
          
        const payload = await DecodedJwtToken(token)           
        const user = await User.findOne({_id:payload['id']})  

        return NextResponse.json({status:"success",msg:"data get found",data:user},{status:200})
        

    }
    catch(e){
        return NextResponse.json({status:"fail",msg:"User not fount"},{satatus:404})
    }
}