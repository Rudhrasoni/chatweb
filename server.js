const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
const { insertMessageAndAssign } = require('./database');

app.use(cors());

app.use(express.json());


app.post("/write", (req, res) => {
  const data = req.body.data;

  if (!data) {
    return res.status(400).json({ message: "No data provided!" });
  }
  insertMessageAndAssign(data);

  fs.readFile("./data/files.txt", "utf8", (err, fileData) => {
    if (err && err.code !== "ENOENT") {
      return res
        .status(500)
        .json({ message: "Failed to read file", error: err });
    }

    const updatedData = ("\n") + data + ", ";

    fs.appendFile("./data/files.txt", updatedData, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Failed to write to file", error: err });
      }
      fs.readFile("./data/files.txt", "utf8", (err, data) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Failed to read file", error: err });
        }
        res.json({ fileData: data });
      });
    });
  });
});

app.get("/read", (req, res) => {
  fs.readFile("./data/files.txt", "utf8", (err, data) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Failed to read file", error: err });
    }
    res.json({ fileData: data });
  });
});

app.get("/", (req, res) => {
  fs.readFile("./data/files.txt", "utf8", (err, data) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Failed to read file", error: err });
    }
    res.json({ fileData: data });
  });
});

const PORT = process.env.PORT || 3001; 
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
