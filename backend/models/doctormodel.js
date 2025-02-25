import mongoose  from "mongoose";
const doctorschema=new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    speciality:{type:String,required:true},
    image:{type:String,required:true},
     location:{type:String},
    degree:{type:String,required:true},
    experience:{type:String,required:true},
    about:{type:String,required:true},
    availiabiilty:{type:Boolean,default: true},
    // rating:{type:String,required:true},
    // reviews:{type:String,required:true},
    fees:{type:Number,required:true},
    address:{type:Object,required:true},
    date:{type:Number,required:true},
    slot_booked:{type:Object,default:{}}

},{minimize:false})
const doctormodel=mongoose.models.doctor||mongoose.model("doctor",doctorschema);

export default doctormodel 