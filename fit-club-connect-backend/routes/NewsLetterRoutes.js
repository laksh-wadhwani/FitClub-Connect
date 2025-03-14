const express = require("express")
const router = express.Router();
const newsLetterTable = require("../models/NewsLetter")
const transporter = require("../middleware/Mail")

router.post("/NewsLetter", async(request, response) => {
    try {
        const { newsLetter } = request.body;
        const newUser = new newsLetterTable({ myNewsLetterUser:newsLetter });
        const userCheck = await newsLetterTable.findOne({ myNewsLetterUser:newsLetter });
        if (!userCheck) {
            let mailOptions = {
                from: process.env.SMTP_MAIL,
                to: newsLetter,
                subject: "Embark on a Wellness Journey with Fit Club Connect's Exclusive Newsletter!",
                text: "Thank you for subscribing to Fit Club Connect's newsletter! 🌟 Get ready to elevate your well-being with our curated updates and exclusive offers delivered straight to your inbox. Stay ahead of the curve and join our thriving community as we guide you through the latest fitness trends, nutrition tips, and exciting promotions. Your journey to a healthier, happier lifestyle begins here. Welcome to Fit Club Connect – where fitness meets convenience! 🏋️‍♀️🍏" + "\n" + "#FitClubConnect" + "\n" + "#WellnessJourney"
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log("Getting Error In Sending Mail: " + error);
                } else {
                    console.log("Mail Sent Successfully");
                }
            });

            await newUser.save();
            response.send({ message: "You are Subscribed to our Newsletter" });
        } 
        else {
            response.send({ message: "You have already Subscribed to our Newsletter" });
        }
    } 
    catch (error) {
        console.log(error);
        response.send({ message: "Error Subscribing to Newsletter" });
    }
});

module.exports = router;