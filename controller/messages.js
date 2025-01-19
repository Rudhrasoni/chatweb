const fs = require("fs");
const file = "./data/messages.txt";
const gfile = "./data/group_messages.txt";

const { insertMessageAndAssign } = require("../models/messages");

async function writeMessages(req, res) {
  const data = req.body.data;

  if (!data) {
    return res.status(400).json({ message: "No data provided!" });
  }
  // insertMessageAndAssign(data);
  const updatedData = "\n" + data + ", ";

  fs.appendFile(file, updatedData, (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Failed to write to file", error: err });
    }
    fs.readFile(file, "utf8", (err, data) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Failed to read file", error: err });
      }
      res.json({ fileData: data });
    });
  });
}

async function readAllMessages(req, res) {
  fs.readFile(file, "utf8", (err, data) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Failed to read file", error: err });
    }
    res.json({ fileData: data });
  });
}
async function allMessage(req, res) {
  fs.readFile(gfile, "utf8", (err, data) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Failed to read file", error: err });
    }
    res.json({ fileData: data });
  });
}

async function sendmessage(req, res) {
  const data = req.body.data;

  if (!data) {
    return res.status(400).json({ message: "No data provided!" });
  }
  // insertMessageAndAssign(data);
  const updatedData = "\n" + data + ", ";

  fs.appendFile(gfile, updatedData, (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Failed to write to file", error: err });
    }
    fs.readFile(gfile, "utf8", (err, data) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Failed to read file", error: err });
      }
      res.json({ fileData: data });
    });
  });
}

module.exports = {
    writeMessages,
    readAllMessages,
    allMessage,
    sendmessage
}