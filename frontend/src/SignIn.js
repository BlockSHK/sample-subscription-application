import React, { Component } from "react";
import { ethers } from "ethers";
import {
  Button,
  TextField,
  Grid,
  Typography,
  Box,
  TextareaAutosize,
} from "@mui/material";
import axios from "axios";

export default class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: "",
      nonce: "",
      signedNonce: "",
      tokenId: "",
      error: null,
    };
    this.handleChange = this.handleChange.bind(this);
    this.getNonce = this.getNonce.bind(this);
    this.signNonce = this.signNonce.bind(this);
    this.sendData = this.sendData.bind(this);
  }

  async componentDidMount() {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      this.setState({ address: accounts[0] });
    } else {
      alert("Please install MetaMask!");
    }
  }

  handleChange(event) {
    const inputValue = event.target.value;
    const stateField = event.target.name;
    this.setState({
      [stateField]: inputValue,
    });
  }

  async getNonce() {
    const { address } = this.state;
    try {
      const response = await axios.post(
        "https://b1r5aq31x2.execute-api.us-east-1.amazonaws.com/Prod/activation/nonce",
        { address }
      );
      this.setState({ nonce: response.data.payload.nonce });
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  async signNonce() {
    const { nonce } = this.state;
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const signedNonce = await signer.signMessage(nonce);
      this.setState({ signedNonce });
    } catch (err) {
      this.setState({ error: err.message });
    }
  }

  async sendData() {
    const { address, tokenId, nonce, signedNonce } = this.state;
    try {
      const response = await axios.post("http://localhost:3000/sign-in", {
        address,
        tokenId,
        nonce,
        signedNonce,
      });
      if (response.status === 201) {
        alert("Signed successfully");
      } else {
        alert("Something went wrong");
      }
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  render() {
    const { error, nonce, signedNonce, tokenId } = this.state;

    return (
      <Box
        component="form"
        noValidate
        autoComplete="off"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "1em",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          width: "50%",
          margin: "0 auto",
          boxSizing: "border-box",
          padding: "1em",
          border: "1px solid #ddd",
          borderRadius: "5px",
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
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
            onChange={this.handleChange}
          />
        )}
        {nonce && (
          <>
            <Typography variant="h5" margin="normal">
              Nonce: {nonce}
            </Typography>
            <TextareaAutosize
              aria-label="Signed Nonce"
              rowsMin={3}
              value={signedNonce ? `Signed Nonce: ${signedNonce}` : ""}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={this.signNonce}
            >
              Sign Nonce
            </Button>
            {signedNonce && tokenId && (
              <Button
                variant="contained"
                color="primary"
                onClick={this.sendData}
              >
                Send Data
              </Button>
            )}
          </>
        )}
        {!nonce && (
          <Button variant="contained" color="primary" onClick={this.getNonce}>
            Get Nonce
          </Button>
        )}
        {error && (
          <Typography variant="h5" color="error">
            Error: {error}
          </Typography>
        )}
      </Box>
    );
  }
}
