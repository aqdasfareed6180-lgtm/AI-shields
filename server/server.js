const express = require("express");
const cors = require("cors");
const path = require("path");

const { analyzeContent } = require("./detector");

const app = express();

const PORT = process.env.PORT || 5000;


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());

app.use(express.json());


// ==========================================
// SERVE FRONTEND
// ==========================================

app.use(
    express.static(
        path.join(__dirname, "../public")
    )
);


// ==========================================
// HOME PAGE
// ==========================================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "../public/index.html"
        )
    );

});


// ==========================================
// FRAUD SCAN API
// ==========================================

app.post("/api/scan", (req, res) => {

    const content =
        req.body.content;


    // Check empty input

    if (
        !content ||
        content.trim() === ""
    ) {

        return res.status(400).json({

            error:
                "Please enter a message or URL."

        });

    }


    // Analyze content

    const result =
        analyzeContent(content);


    // Send result to frontend

    res.json(result);

});


// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );

});