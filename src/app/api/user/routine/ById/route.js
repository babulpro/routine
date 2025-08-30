import { connectToDB } from "@/app/lib/DbConnect"
import Routine from "@/app/models/Routine"
import { NextResponse } from "next/server"

export async function POST(req,res){
    try{
        await connectToDB()
        let data = await req.json() 
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if(!id){
            return NextResponse.json({status:"fail",msg:"id is required"},{status:404})
        }
        let findRoutine = await Routine.findById(id)
        if(!findRoutine){
            return NextResponse.json({status:"fail",msg:"routine not found"},{status:404})
        }
        let updateRoutine = await Routine.findByIdAndUpdate(id,data)
        if(!updateRoutine){
            return NextResponse.json({status:"fail",msg:"routine not updated"},{status:404})
        }
        return NextResponse.json({status:"success",msg:"routine updated successfully"},{status:200})
    }
    catch(e){
        return NextResponse.json({status:"fail",msg:"someting went wrong"},{status:404})
    }

}


 export async function PUT(req) {
  try {
    await connectToDB();

    // Extract ID from query parameters
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    // Validate ID
    if (!id) {
      return NextResponse.json(
        { status: "fail", message: "ID is required" },
        { status: 400 } // Changed to 400 (Bad Request) for missing required field
      );
    }

    // Parse request body
    const data = await req.json();

    // Check if routine exists
    const existingRoutine = await Routine.findById(id);
    if (!existingRoutine) {
      return NextResponse.json(
        { status: "fail", message: "Routine not found" },
        { status: 404 }
      );
    }

    // Update routine with validation and return the updated document
    const updatedRoutine = await Routine.findByIdAndUpdate(
      id,
      data,
      { 
        new: true, // Return the updated document
        runValidators: true // Run model validators on update
      }
    );

    if (!updatedRoutine) {
      return NextResponse.json(
        { status: "fail", message: "Failed to update routine" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        status: "success", 
        message: "Routine updated successfully",
        data: updatedRoutine // Include the updated routine in response
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error updating routine:", error);
    return NextResponse.json(
      { 
        status: "error", 
        message: error.message || "Internal server error" 
      },
      { status: 500 } // Changed to 500 for server errors
    );
  }
}

export async function DELETE(req){
    try{
        await connectToDB()
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        const data = await Routine.findByIdAndDelete(id)
      
       return NextResponse.json({status:"success"})
       

    }
    catch(e){
        return NextResponse.json({status:"fail",msg:"something went wrong"})
    }
}


export async function GET(req){
    try{
        await connectToDB()
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        const data = await Routine.findById(id)
      
       return NextResponse.json({status:"success",data:data})
       

    }
    catch(e){
        return NextResponse.json({status:"fail",msg:"something went wrong"})
    }
}