const express = require("express");
const app = express();
const PORT = 5000;

app.use(express.json());

// Endpoint for ingesting logs
app.post("/logs", (req, res) => {
    const logData = req.body;
    console.log("Received log:", logData);

    const ingestedLogsString = localStorage.getItem("ingestLogs");
    const ingestedLogs = ingestedLogsString ? JSON.parse(ingestedLogsString) : [];
    ingestedLogs.push(logData);
    localStorage.setItem("ingestLogs", JSON.stringify(ingestedLogs));

    res.status(200).json({ message: "Log received successfully" });
});

// Endpoint for searching logs
app.post("/search-logs", (req, res) => {
    const searchParams = req.body;
    const results = searchLogs(searchParams);
    res.json(results);
});

function searchLogs(searchParams) {
    const ingestedLogsString = localStorage.getItem("ingestLogs");
    const ingestedLogs = ingestedLogsString ? JSON.parse(ingestedLogsString) : [];

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
                    default:
                        return true;
                }
            }
            return true;
        });
    });
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
