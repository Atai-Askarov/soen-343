import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "./css/ShareResource.css";

const ShareResourcePage = () => {
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);
  const { eventId } = useParams();
  const dropRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...droppedFiles]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("message", message);

      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch(`http://localhost:5000/share-resource/${eventId}`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("✅ Resource shared successfully!");
      } else {
        const errorData = await response.json();
        console.error("Server error response:", errorData);
        alert("❌ Failed to share resource.");
      }
    } catch (error) {
      console.error("❌ Error sharing resource:", error);
      alert("❌ Failed to share resource.");
    }
  };

  return (
    <div className="share-resource-page">
      <h2>Share Resources</h2>

      <label>Message:</label>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={6}
        placeholder="Write a message to include with your resource..."
      />

      <div
        ref={dropRef}
        className="drop-zone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <p>Drag & drop files here or click to select</p>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          style={{ display: "none" }}
          id="fileInput"
        />
        <label htmlFor="fileInput" className="file-input-button">
          Browse Files
        </label>
      </div>

      {files.length > 0 && (
        <ul className="file-list">
          {files.map((file, index) => (
            <li key={index}>
              {file.name}{" "}
              <button className="remove-btn" onClick={() => handleRemoveFile(index)}>
                ❌ Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      <button className="submit-button" onClick={handleSubmit}>
        Send Resources to all Attendees
      </button>
    </div>
  );
};

export default ShareResourcePage;
