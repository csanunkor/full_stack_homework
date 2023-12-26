const connection = require("../config/mysql.config.js");
const fs = require("fs");

const query = `SELECT DISTINCT
customer.name as customer, 
part.name as part, 
part_revision.name as revision,
trial.uuid as trial,
file.location as file_location
FROM customer
LEFT JOIN part ON customer.uuid = part.customer_uuid
LEFT JOIN part_revision ON part.uuid = part_revision.part_uuid 
LEFT JOIN trial ON part_revision.uuid = trial.part_revision_uuid
LEFT JOIN process_run ON trial.uuid = process_run.trial_uuid
LEFT JOIN process_run_file_artifact ON process_run.uuid = process_run_file_artifact.process_run_uuid
LEFT JOIN file ON process_run_file_artifact.file_artifact_uuid = file.uuid OR part_revision.geometry_file_uuid = file.uuid`;

function buildFileTree(results) {
  let fileTree = [];

  for (const data of results) {
    //Build customers array
    let customer = fileTree.find((c) => c.customerName === data.customer);
    if (customer === undefined) {
      customer = { customerName: data.customer, parts: [] };
      fileTree.push(customer);
    }

    // Build parts array
    let part = customer.parts.find((p) => p.partName === data.part);
    if (part === undefined) {
      part = { partName: data.part, revisions: [], trials: [] };
      customer.parts.push(part);
    }

    //build revisions array
    let revision = part.revisions.find((r) => r.revisionName === data.revision);
    if (revision === undefined) {
      revision = { revisionName: data.revision, data: [] };
      part.revisions.push(revision);
    }

    //build trials array
    let trial = part.trials.find((t) => t.trialName === data.trial);
    if (trial === undefined) {
      trial = { trialName: data.trial, data: [] };
      part.trials.push(trial);
    }

    //add files to revisions or trials
    if (data.file_location.includes("trials"))
      trial.data.push(data.file_location);
    else if (data.file_location.includes("revisions"))
      revision.data.push(data.file_location);
  }

  return fileTree;
}

exports.getFileTree = async (req, res, next) => {
  try {
    connection.query(query, (error, results) => {
      if (error) {
        next(error);
        res.status(500).send(error);
      } else {
        let fileTree = buildFileTree(results);
        res.status(200).json({ success: true, data: fileTree });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.readFile = async (req, res, next) => {
  if (!req.query.filePath)
    res.status(400).send("Bad Request: Please specify a file path");

  const filePath = "../client/public/files/" + req.query.filePath;

  fs.readFile(filePath, "utf8", (error, data) => {
    if (error) {
      next(error);
    } else {
      data = data.split("\n"); // split the document into lines
      data.length = 500; // set the total number of lines
      res.status(200).json({ success: true, data: data });
    }
  });
};
