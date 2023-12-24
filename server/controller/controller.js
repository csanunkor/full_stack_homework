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
  let customerA = {
    customerName: results[0].customer,
    parts: [
      {
        partName: results[0].part,
        revisions: [
          {
            revisionName: results[0].revision,
            data: [
              "customers/d4b11d78-74e2-4efb-987c-38e2eb1a7a02/parts/4ca4f320-536c-4b2e-b63f-80c4a55b719d/revisions/d09f9cc9-30cc-480d-8d15-f1e5de5c5f1a/flange.stl",
            ],
          },
          {
            revisionName: results[3].revision,
            data: [
              "customers/d4b11d78-74e2-4efb-987c-38e2eb1a7a02/parts/4ca4f320-536c-4b2e-b63f-80c4a55b719d/revisions/cc50e60d-42c3-4a30-9c1b-8a8e0d2e0717/flange.step",
            ],
          },
        ],
        trials: [
          {
            trialName: results[0].trial,
            data: [
              "customers/d4b11d78-74e2-4efb-987c-38e2eb1a7a02/parts/4ca4f320-536c-4b2e-b63f-80c4a55b719d/trials/0e7c36da-4125-4c13-8e5b-2e1a3d51c57e/form_path.csv",
              "customers/d4b11d78-74e2-4efb-987c-38e2eb1a7a02/parts/4ca4f320-536c-4b2e-b63f-80c4a55b719d/trials/0e7c36da-4125-4c13-8e5b-2e1a3d51c57e/form_build.csv",
            ],
          },
          {
            trialName: results[3].trial,
            data: [
              "customers/d4b11d78-74e2-4efb-987c-38e2eb1a7a02/parts/4ca4f320-536c-4b2e-b63f-80c4a55b719d/trials/b58fb2c9-5a3d-44a0-89ef-ecb510883a1a/form_build.csv",
              "customers/d4b11d78-74e2-4efb-987c-38e2eb1a7a02/parts/4ca4f320-536c-4b2e-b63f-80c4a55b719d/trials/b58fb2c9-5a3d-44a0-89ef-ecb510883a1a/rsi1way_c1r1_state.log",
              "customers/d4b11d78-74e2-4efb-987c-38e2eb1a7a02/parts/4ca4f320-536c-4b2e-b63f-80c4a55b719d/trials/b58fb2c9-5a3d-44a0-89ef-ecb510883a1a/scanner_c1r1.log",
              "customers/d4b11d78-74e2-4efb-987c-38e2eb1a7a02/parts/4ca4f320-536c-4b2e-b63f-80c4a55b719d/trials/b58fb2c9-5a3d-44a0-89ef-ecb510883a1a/scan_mesh.ply",
              "customers/d4b11d78-74e2-4efb-987c-38e2eb1a7a02/parts/4ca4f320-536c-4b2e-b63f-80c4a55b719d/trials/b58fb2c9-5a3d-44a0-89ef-ecb510883a1a/zmetric.json",
            ],
          },
        ],
      },
    ],
  };

  let customerB = {
    customerName: results[10].customer,
    parts: [
      {
        partName: results[10].part,
        revisions: [
          {
            revisionName: results[10].revision,
            data: [
              "customers/a0373fc3-f7f3-42ec-aa7d-222f16b35c882/parts/d45f5112-1c67-49ef-a61d-16b1f3d3be7c/revisions/d09f9cc9-30cc-480d-8d15-f1e5de5c5f1a/stiffener.stl",
            ],
          },
        ],
        trials: [
          {
            trialName: results[10].trial,
            data: [
              "customers/a0373fc3-f7f3-42ec-aa7d-222f16b35c882/parts/d45f5112-1c67-49ef-a61d-16b1f3d3be7c/trials/279b93c7-d0d9-48f7-8098-08712d7c775d/form_path.csv",
              "customers/a0373fc3-f7f3-42ec-aa7d-222f16b35c882/parts/d45f5112-1c67-49ef-a61d-16b1f3d3be7c/trials/279b93c7-d0d9-48f7-8098-08712d7c775d/form_build.csv",
            ],
          },
        ],
      },
    ],
  };

  fileTree.push(customerA, customerB);
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
