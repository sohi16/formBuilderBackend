const express = require("express");
const cors = require('cors');
const { connection } = require("./db");
const { FormRouter } = require("./route/FormRoutes");
const { ResponseRouter } = require("./route/ResponseRoutes");

const { FormModel } = require('./model/FormModel');
const { ResponseModel } = require('./model/ResponseModel');
const dotenv=require('dotenv')
const path =require('path');
const app = express();

app.use(cors());

app.use(express.json());
app.use("/forms", FormRouter)
app.use("/response", ResponseRouter)
// dotenv.config();

const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
    res.send(" form builder")
})

app.post("/createForm", (req, res) => {
    const { header, formId, questions } = req.body;
    const sendData = new FormModel({
        header: header,
        formId: formId,
        questions: questions
    })
    const saveResponse = sendData.save();
    console.log(saveResponse);
    res.status(200).json({
        
        sucess: true
    })
})

app.post("/create", (req, res) => {
    const { name, email, formId, response } = req.body;
    const sendData = new ResponseModel({
        name: name,
        email: email,
        formId: formId,
        response: response
    })
    const saveResponse = sendData.save();
    res.status(200).json({
        sucess: true
    })
})

app.get("/preview/:formId", async (req, res) => {
    try {
        const { formId } = req.params;
        const formData = await FormModel.findOne({ formId: formId });

        if (!formData) {
            return res.status(404).json({ error: "Form not found" });
        }

        res.sendFile(path.join(__dirname, 'path-to-your-frontend', 'build', 'index.html'));
    } catch (err) {
        console.error("Error fetching form data:", err);
        res.status(500).json({ error: "Server error" });
    }
});

app.listen(PORT, async () => {
    try {
        await connection
        console.log("DB is connected!!")
    } catch (error) {
        console.log(error)
    }
    console.log("app is running at the port ",PORT)
})

