const fs = require("fs");
const path = require("path");
const express = require("express");
const cors_proxy = require("cors-anywhere");

const app = express();
const PORT = process.env.PORT || 6969;

const DMOJ_AUTH_KEY = "AAKjHjB6bCy0NJRygjxtUC30JibmN925tpqT9I-6IRxTrlzH"

app.use(express.json());
app.use(express.static("public")); // serves your frontend files

// ----------------- CORS PROXY -----------------
const proxy = cors_proxy.createServer({
  originWhitelist: [], // Allow all origins
  requireHeader: [],
  removeHeaders: ["cookie", "cookie2"]
});
// Mount proxy under /proxy/*
app.use("/proxy", async (req, res) => {
  try {
    // Strip `/proxy` from the path and build the target URL
    let targetUrl = req.url.replace(/^\/proxy\//, "");
    if (targetUrl.startsWith("/")) {
        targetUrl = targetUrl.slice(1);
    }

    console.log("Fetching from:", targetUrl);

    // Make the request to DMOJ with auth header
    const response = await fetch(targetUrl, {
      headers: {
        "Authorization": `Bearer ${DMOJ_AUTH_KEY}`,
      },
    });

    // Forward the response back
    const text = await response.text(); // in case it's not JSON
    res.set("Content-Type", response.headers.get("content-type") || "application/json");
    res.status(response.status).send(text);

  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: "Proxy request failed" });
  }
});

// ----------------- HELPER FUNCTIONS -----------------
function getRandomString() {
  let alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  let amount = Math.ceil(Math.random() * 24);
  for (let i = 0; i < amount; i++) {
    id += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return id;
}

function generateContestID() {
  const dataPath = path.join(__dirname, "data.json");
  return new Promise((resolve, reject) => {
    fs.readFile(dataPath, "utf8", (err, jsonString) => {
      if (err) return reject(err);

      const s_data = JSON.parse(jsonString);
      const contests = s_data.contests || [];
      const currContestIDs = contests.map(c => c.id);

      let tempID = getRandomString();
      while (currContestIDs.includes(tempID)) {
        tempID = getRandomString();
      }
      resolve(tempID);
    });
  });
}

// ----------------- ROUTES -----------------

// Root
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Get new contest ID
app.post("/getnewcid", async (req, res) => {
  try {
    let cid = await generateContestID();
    res.json({ new_id: cid });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Could not generate contest ID" });
  }
});

// Save data
app.post("/savedata", (req, res) => {
  const clientData = req.body;
  if (!clientData) {
    return res.status(400).json({ error: "No data provided" });
  }

  const dataType = clientData.type;
  const contestID = clientData.contest_id;
  const action = clientData.action;
  const dataPath = path.join(__dirname, "data.json");

  fs.readFile(dataPath, "utf8", (err, jsonString) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).json({ error: "Could not read file" });
    }

    let s_data;
    try {
      s_data = JSON.parse(jsonString);
    } catch (parseErr) {
      console.error("Invalid JSON:", parseErr);
      return res.status(500).json({ error: "Invalid JSON in file" });
    }

    const contests = s_data.contests;
    const contest = contests.find(c => c.id == contestID);
    if (!contest) {
      return res.status(404).json({ error: "Contest not found" });
    }

    if (dataType === "user") {
      const user = clientData.name;
      if (user == "" || user == null) {
        return res.status(404).json({ error: "Invalid User" });
      }
      if (action === "add" && !contest.users.includes(user)) {
        contest.users.push(user);
      } else if (action === "remove") {
        contest.users = contest.users.filter(u => u !== user);
      }
    } else if (dataType === "problem") {
      const prblm = clientData.problem_id;
      if (prblm == "" || prblm == null) {
        return res.status(404).json({ error: "Invalid Problem ID" });
      }
      if (action === "add" && !contest.problems.includes(prblm)) {
        contest.problems.push(prblm);
      } else if (action === "remove") {
        contest.problems = contest.problems.filter(p => p !== prblm);
      }
    }

    fs.writeFile(dataPath, JSON.stringify(s_data), "utf8", writeErr => {
      if (writeErr) {
        console.error("Error writing JSON file:", writeErr);
        return res.status(500).json({ error: "Could not write file" });
      }
      console.log("Successfully updated contest data");
      res.json({ status: "Success", data: clientData });
    });
  });
});

// Get all data
app.get("/data", (req, res) => {
  const dataPath = path.join(__dirname, "data.json");
  fs.readFile(dataPath, "utf8", (err, jsonString) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).json({ error: "Failed to read data file" });
    }
    try {
      const data = JSON.parse(jsonString);
      res.json(data);
    } catch (parseErr) {
      console.error("Error parsing JSON:", parseErr);
      res.status(500).json({ error: "Invalid JSON format" });
    }
  });
});

// Create contest
app.post("/create", (req, res) => {
  const dataPath = path.join(__dirname, "data.json");
  fs.readFile(dataPath, "utf8", (err, jsonString) => {
    if (err) {
      console.error("Error");
      return res.status(500).json({ error: "Failed to read data file" });
    }
    try {
      let jso = JSON.parse(jsonString);
      generateContestID().then(cid => {
        req.body.id = cid;
        jso.contests.push(req.body);
        fs.writeFile(dataPath, JSON.stringify(jso, null, 2), "utf8", err => {
          if (err) {
            console.log("Error writing file!!");
          } else {
            console.log("File Overwritten!");
            res.json({ yay: "yay" });
          }
        });
      });
    } catch (parseErr) {
      console.error("Oopsies");
      res.status(500).json({ error: "Invalid JSON format" });
    }
  });
});




// ----------------- START SERVER -----------------
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});