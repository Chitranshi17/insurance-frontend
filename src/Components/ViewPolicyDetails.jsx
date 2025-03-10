import {
  Dialog,
  IconButton,
  Typography,
  Box,
  Button,
  TextField,
  useMediaQuery,
} from "@mui/material";
import { Close, CloudUpload } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getSurveyorClaimImage,
  getSurveyorPolicyList,
  objectDamageData,
} from "../Redux/Slice/dataSlice";
import toast from "react-hot-toast";

const ViewPolicyDetails = ({ open, handleClose, viewPolicy }) => {
  const { claimImageData } = useSelector((state) => state.data);
  const [assessment, setAssessment] = useState("");
  const [surveyorComments, setSurveyorComments] = useState("");
  const [damagePercentage, setDamagePercentage] = useState(null);
  const [imageName, setImageName] = useState("Upload Damage Image*");
  const isMobile = useMediaQuery("(max-width:600px)");
  const [damageImage, setDamageImage] = useState(null);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageName(file.name);
      setDamageImage(file);
    }
  };

  const dispatch = useDispatch();

  const handleDamageCalculation = () => {
    if (!damageImage) {
      toast.error("Please upload a damage image.");
      console.error("Error: damageImage is empty or null.");
      return;
    }

    const formData = new FormData();
    formData.append("assessment", assessment);
    formData.append("surveyorComments", surveyorComments);
    formData.append("damageImage", damageImage);

    const data = {
      formData: formData,
      id: viewPolicy?.policyId,
    };

    dispatch(objectDamageData(data)).then((res) => {
      if (
        res?.payload?.message ===
        "Surveyor review submitted. Awaiting government approval."
      ) {
        setAssessment("");
        setSurveyorComments("");
        setDamageImage(null);
        setImageName("Upload Damage Image*");
        dispatch(getSurveyorPolicyList());
        toast.success("Review submitted to government!");
        setDamagePercentage(res?.payload?.surveyorReport?.damagePercentage);
      }
    });
  };

  const policyIdSave = viewPolicy?.policyId;
  useEffect(() => {
    dispatch(getSurveyorClaimImage(policyIdSave));
  }, [policyIdSave, damagePercentage]);

  const handleCloseModal = () => {
    handleClose();
    setDamagePercentage(null);
  };

  return (
    <Dialog
      open={open}
      onClose={handleCloseModal}
      fullScreen
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Box
        sx={{
          paddingBlock: "3vh",
          paddingInline: { xs: "6vw", sm: "4vh" },
          width: { xs: "91%", sm: "97%" },
          position: "relative",
        }}
      >
        <IconButton
          onClick={handleCloseModal}
          sx={{
            position: "absolute",
            top: "10px",
            right: "10px",
            color: "#6200ea",
            "&:hover": { color: "#4500b5" },
          }}
        >
          <Close />
        </IconButton>

        <Typography
          fontWeight={"800"}
          fontFamily={"inherit"}
          sx={{
            textDecoration: "underline",
            textAlign: "center",
            fontSize: { xs: "5vh", sm: "3.5vh" },
          }}
          color="#6200ea"
        >
          Policy Details
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            marginTop: "1vh",
            paddingInline: { xs: "2vw", sm: "2vh" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Typography
              sx={{ fontSize: { xs: "2vh", sm: "1.8vh" }, fontWeight: "800" }}
            >
              Policy ID: {viewPolicy?.policyId}
            </Typography>
            <Typography
              sx={{ fontSize: { xs: "2vh", sm: "1.8vh" }, fontWeight: "800" }}
            >
              Insurance Amount: ₹{viewPolicy?.insuranceAmount}
            </Typography>
          </Box>
          <Typography
            sx={{ fontSize: { xs: "2vh", sm: "1.8vh" }, fontWeight: "800" }}
          >
            Description: {viewPolicy?.claimDetails?.damageDescription}
          </Typography>
        </Box>

        <Box sx={{ marginTop: "1.5vh" }}>
          <TextField
            label="Assessment*"
            type="text"
            value={assessment}
            onChange={(e) => setAssessment(e.target.value)}
            fullWidth
            name="assessment"
            variant="outlined"
            size="small"
            disabled={viewPolicy?.policyStatus != "under review"}
            sx={{ marginBottom: "1vh" }}
          />
          <TextField
            label="Comments*"
            type="text"
            value={surveyorComments}
            onChange={(e) => setSurveyorComments(e.target.value)}
            fullWidth
            name="surveyorComments"
            variant="outlined"
            size="small"
            disabled={viewPolicy?.policyStatus != "under review"}
            sx={{ marginTop: "1vh" }}
          />
          <Box sx={{ marginTop: "2vh" }}>
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              id="upload-button"
              onChange={(e) => {
                handleImageChange(e);
              }}
            />
            <label htmlFor="upload-button">
              <Button
                component="span"
                variant="contained"
                startIcon={<CloudUpload />}
                sx={{
                  backgroundColor: "#6200ea",
                  color: "white",
                  textTransform: "none",
                  fontWeight: "bold",
                  padding: isMobile ? "8px 30px" : "10px 57px",
                  borderRadius: "8px",
                  height: "5.4vh",
                  "&:hover": { backgroundColor: "#4500b5" },
                }}
                disabled={viewPolicy?.policyStatus != "under review"}
              >
                {imageName.length > 20
                  ? `${imageName.substring(0, 17)}...`
                  : imageName}
              </Button>
            </label>
          </Box>
        </Box>

        <Box sx={{ marginTop: "2vh" }}>
          <Button
            variant="contained"
            sx={{ fontWeight: "bold" }}
            onClick={handleDamageCalculation}
            disabled={viewPolicy?.policyStatus != "under review"}
          >
            Calculate Damage Percentage and send to admin
          </Button>
          <Typography sx={{ fontWeight: "bold", marginTop: "2vh" }}>
            Damage Percentage:{" "}
            {viewPolicy?.surveyorReport?.damagePercentage !== undefined
              ? `${viewPolicy?.surveyorReport?.damagePercentage}%`
              : damagePercentage !== null
              ? `${damagePercentage}%`
              : null}
          </Typography>
        </Box>

        <Box
          sx={{
            width: "100%",
            height: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "1vh",
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <img
            style={{
              width: "48%",
              height: "auto",
              border: "1px solid black",
            }}
            src={claimImageData?.beforeDamageImage}
          />
          <img
            style={{
              width: "48%",
              height: "auto",
              border: "1px solid black",
            }}
            src={claimImageData?.surveyorDamageImage}
          />
        </Box>
      </Box>
    </Dialog>
  );
};

export default ViewPolicyDetails;
