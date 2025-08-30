import { DecodedJwtToken } from "@/app/lib/authFunction/JwtHelper"
import { connectToDB } from "@/app/lib/DbConnect"
import User from "@/app/models/User"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(req) {
  try { 
    await connectToDB() 
    const cookieStore =await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { status: "fail", msg: "No token found" },
        { status: 401 }
      )
    }

    const payload = await DecodedJwtToken(token) 
     const email = payload['email']
     const user = await User.findOne({email:email}) 
    if (!user) {
      return NextResponse.json(
        { status: "fail", msg: "User not found" },
        { status: 404 }
      )     }  
    const allUser = await User.find() 
    return NextResponse.json({status:"success",data:allUser})
     

    
  } catch (e) {
    console.error("API Error:", e)
    return NextResponse.json(
      { status: "fail", msg: e.message },
      { status: e.statusCode || 500 }
    )
  }
}

 


export async function PUT(request) {
  try {
    await connectToDB() 
    const { userId, role } = await request.json();
    
    // Update user role in database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    );
    
    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}