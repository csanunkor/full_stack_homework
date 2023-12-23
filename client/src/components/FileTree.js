import { useState, useEffect } from "react";
import { TreeView, TreeItem } from "@mui/x-tree-view";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";
import { Modal } from "@mui/material";
import uniqid from "uniqid";

const FileModal = ({
  data,
  open,
  handleClose,
  fileName,
  filePath,
  non3DFile,
}) => {
  const [fileContent, setFileContent] = useState([]);
  const publicFilePath = "/files/" + filePath;

  useEffect(() => {
    axios
      .get(` http://192.168.0.86:4000/api/readfile?filePath=${data}`)
      .then((response) => {
        non3DFile
          ? setFileContent(response.data.data)
          : setFileContent([
              "3D Files Can Not Be Previewed...",
              "Please Download To View File",
            ]);
      })
      .catch((error) => {
        console.error("Error reading file tree:", error);
      });
  }, [data, non3DFile]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <div
        style={{
          position: "absolute",
          top: "10vh",
          left: "30vw",
          width: "25vw",
          height: "55vh",
          backgroundColor: "white",
          boxShadow: "3px 5px 7px",
          border: "2px solid #000",
          padding: "0px 100px 190px 10px",
        }}
      >
        <h3>{fileName}</h3>
        <div style={{ width: "31.5vw", height: "69vh", overflow: "auto" }}>
          {fileContent.map((line, index) => {
            return (
              <div key={index} style={{ overflowWrap: "break-word" }}>
                {line}
              </div>
            );
          })}
        </div>
        <a href={publicFilePath} download={fileName}>
          <button
            style={{
              marginLeft: 150,
              marginTop: 40,
              fontSize: 20,
              backgroundColor: "orange",
            }}
          >
            DOWNLOAD
          </button>
        </a>
      </div>
    </Modal>
  );
};

const FileViewComponent = ({ fileName, filePath }) => {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);
  const exclude3DFiles = [".ply", ".stl"]; // 3D file extensions to exclude from preview

  let non3DFile = exclude3DFiles.every((ext) => !fileName.endsWith(ext));

  return (
    <>
      <TreeItem nodeId={`${uniqid()}`} label={fileName} onClick={handleOpen} />
      <FileModal
        data={filePath}
        open={open}
        handleClose={handleClose}
        fileName={fileName}
        filePath={filePath}
        non3DFile={non3DFile}
      ></FileModal>
    </>
  );
};

const FileViewTree = ({ data }) => {
  //get file name
  let files = [];
  for (const file of data) {
    let arr = file.split("/");
    files.push({ fileName: arr[arr.length - 1], filePath: file });
  }

  return (
    <ul style={{ listStyleType: "none", padding: 0 }}>
      {files.map((file, index) => (
        <FileViewComponent
          key={index}
          fileName={file.fileName}
          filePath={file.filePath}
        />
      ))}
    </ul>
  );
};

const RevisionTree = ({ data }) => {
  return (
    <ul style={{ listStyleType: "none", padding: 0 }}>
      <TreeItem nodeId={`${uniqid()}`} label="Revisions">
        {data.map((node, index) => (
          <div key={index}>
            <TreeItem nodeId={`${uniqid()}`} label={node?.revisionName}>
              <FileViewTree data={node.data} />
            </TreeItem>
          </div>
        ))}
      </TreeItem>
    </ul>
  );
};

const TrialTree = ({ data }) => {
  return (
    <ul style={{ listStyleType: "none", padding: 0 }}>
      <TreeItem nodeId={`${uniqid()}`} label="Trials">
        {data.map((node, index) => (
          <div key={index}>
            <TreeItem
              tabIndex={8}
              nodeId={`${uniqid()}`}
              label={node?.trialName}
            >
              <FileViewTree data={node.data} />
            </TreeItem>
          </div>
        ))}
      </TreeItem>
    </ul>
  );
};

const PartTree = ({ data }) => {
  return (
    <ul style={{ listStyleType: "none", padding: 0 }}>
      <TreeItem nodeId={`${uniqid()}`} label="Parts">
        {data.map((node, index) => (
          <div key={index}>
            <TreeItem nodeId={`${uniqid()}`} label={node?.partName}>
              <RevisionTree data={node.revisions}></RevisionTree>
              <TrialTree data={node.trials}></TrialTree>
            </TreeItem>
          </div>
        ))}
      </TreeItem>
    </ul>
  );
};

const CustomerTree = ({ data }) => {
  return (
    <ul style={{ listStyleType: "none", padding: 0 }}>
      {data.map((node, index) => (
        <div key={index}>
          <TreeItem nodeId={`${uniqid()}`} label={node?.customerName}>
            <PartTree data={node.parts}></PartTree>
          </TreeItem>
        </div>
      ))}
    </ul>
  );
};

function FileTree() {
  const [fileTreeData, setFileTreeData] = useState([]);

  useEffect(() => {
    axios
      .get(" http://192.168.0.86:4000/api/filetree")
      .then((response) => {
        setFileTreeData(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching file tree:", error);
      });
  }, []);

  return (
    <TreeView
      aria-label="file system navigator"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      sx={{
        height: "750vh",
        flexGrow: 1,
        maxWidth: "950vw",
        overflowY: "auto",
      }}
    >
      <TreeItem nodeId="0" label="Files">
        <TreeItem nodeId="1" label="Customers">
          <CustomerTree data={fileTreeData}></CustomerTree>
        </TreeItem>
      </TreeItem>
    </TreeView>
  );
}

export default FileTree;
