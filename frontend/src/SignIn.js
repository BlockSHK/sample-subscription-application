import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  Button,
  TextField,
  Typography,
  Box,
  TextareaAutosize,
  Paper,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const [address, setAddress] = useState("");
  const [nonce, setNonce] = useState("");
  const [signedNonce, setSignedNonce] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const initialize = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAddress(accounts[0]);
      } else {
        alert("Please install MetaMask!");
      }
    };
    initialize();
  }, []);

  const getNonce = async () => {
    try {
      const response = await axios.post(
        "https://b1r5aq31x2.execute-api.us-east-1.amazonaws.com/Prod/activation/nonce",
        { address }
      );
      setNonce(response.data.payload.nonce);
    } catch (error) {
      setError(error.message);
    }
  };

  const signNonce = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const signedNonce = await signer.signMessage(nonce);
      setSignedNonce(signedNonce);
    } catch (err) {
      setError(err.message);
    }
  };

  const sendData = async () => {
    try {
      const response = await axios.post("http://localhost:3000/sign-in", {
        address,
        tokenId,
        nonce,
        signedNonce,
      });

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        navigate("/");
      } else {
        alert("Invalid Sign In");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Paper
      component="form"
      noValidate
      autoComplete="off"
      elevation={3}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "1em",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        width: { xs: "90%", sm: "60%", md: "40%" },
        margin: "0 auto",
        boxSizing: "border-box",
        padding: "2em",
        borderRadius: "10px",
      }}
    >
      <Typography variant="h3" component="h1" gutterBottom>
        Sign a Message
      </Typography>
      {nonce && (
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="tokenId"
          label="Token ID"
          name="tokenId"
          autoFocus
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
        />
      )}
      {nonce && (
        <>
          <Typography variant="h6" margin="normal">
            Nonce: {nonce}
          </Typography>
          <TextareaAutosize
            aria-label="Signed Nonce"
            minRows={3}
            style={{ width: "100%", padding: "0.5em", marginBottom: "1em" }}
            value={signedNonce ? `Signed Nonce: ${signedNonce}` : ""}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={signNonce}
            size="large"
          >
            Sign Nonce
          </Button>
          {signedNonce && tokenId && (
            <Button
              variant="contained"
              color="secondary"
              onClick={sendData}
              size="large"
            >
              Sign In
            </Button>
          )}
        </>
      )}
      {!nonce && (
        <Button
          variant="contained"
          color="primary"
          onClick={getNonce}
          size="large"
        >
          Get Nonce
        </Button>
      )}
      {error && (
        <Typography variant="h6" color="error">
          Error: {error}
        </Typography>
      )}
    </Paper>
  );
};

export default SignIn;
