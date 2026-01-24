import express from 'express';
import cookieParser from "cookie-parser";
import cors from 'cors';

const app=express();
app.use(cors({
    origin:'*'
}));
app.use(express.json({limit:"16Kb"}));
app.use(express.urlencoded({extended:true,limit:"16kb"}));
app.use(express.static('public'));
app.use(cookieParser());

//routes
import userRouter from './routes/user.routes.js'
import vendorRouter from './routes/vendor.routes.js'
import chatRouter from './routes/chat.routes.js'
app.use("/api/v1/users",userRouter);
app.use("/api/v1/vendors",vendorRouter);
app.use("/api/v1/chat",chatRouter);
export {app};

