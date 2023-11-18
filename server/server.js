const express = require("express");
const app = express();
const PORT = 5000;

app.use(express.json());

// Endpoint for ingesting logs
app.post("/logs", (req, res) => {
    const logData = req.body;
    console.log("Received log:", logData);

    // Implement storage logic (e.g., save to localStorage)
    const ingestedLogsString = localStorage.getItem("ingestLogs");
    const ingestedLogs = ingestedLogsString ? JSON.parse(ingestedLogsString) : [];
    ingestedLogs.push(logData);
    localStorage.setItem("ingestLogs", JSON.stringify(ingestedLogs));

    res.status(200).json({ message: "Log received successfully" });
});

// Endpoint for searching logs
app.post("/search-logs", (req, res) => {
    const searchParams = req.body; // Assuming the search parameters are sent in the request body
    const results = searchLogs(searchParams); // Implement the actual search logic
    res.json(results);
});

// Function to search logs based on provided filters
function searchLogs(searchParams) {
    const ingestedLogsString = localStorage.getItem("ingestLogs");
    const ingestedLogs = ingestedLogsString ? JSON.parse(ingestedLogsString) : [];

    // Implement the logic to filter logs based on searchParams
    return ingestedLogs.filter((log) => {
        return Object.keys(searchParams).every((param) => {
            if (searchParams[param] !== "") {
                switch (param) {
                    case "level":
                        return log.level === searchParams.level;
                    case "message":
                        return log.message.includes(searchParams.message);
                    case "resourceId":
                        return log.resourceId === searchParams.resourceId;
                    case "timestamp":
                        return new Date(log.timestamp) >= new Date(searchParams.timestamp.start) && new Date(log.timestamp) <= new Date(searchParams.timestamp.end);
                    // Add more cases for other parameters if needed
                    default:
                        return true; // Default to true for any other parameters
                }
            }
            return true; // Return true if the search parameter is an empty string
        });
    });
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
