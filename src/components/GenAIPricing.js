import React, { useState } from 'react';
import { MenuItem, FormControl, InputLabel, Select, Container, Box, Typography, AppBar, Toolbar, Button, Snackbar, Alert, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TableFooter } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { styled } from '@mui/system';

function GenAIPricing() {
  const [model, setModel] = useState('');
  const [inputSets, setInputSets] = useState([
    { messageType: '', posts: '', avgWords: '', avgWords2: '', avgIterations: '', cost: '', avgTokens: '', avgTokens2: '' },
  ]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Fetch average tokens from environment variables
  const getAverageTokens = (model, topK) => {
    const parseEnv = (key) => parseFloat(process.env[key] || 5000);

    switch (model) {
      case '0.0600': // GPT-4-32K
        console.log("32")
        return (
          (parseEnv('REACT_APP_GPT4_32K_TOPK_3_AVG_TOKENS') +
            parseEnv('REACT_APP_GPT4_32K_TOPK_5_AVG_TOKENS') +
            parseEnv('REACT_APP_GPT4_32K_TOPK_7_AVG_TOKENS')) /
          3
        );
      case '0.0300': // GPT-4-8K
        return (
          (parseEnv('REACT_APP_GPT4_8K_TOPK_3_AVG_TOKENS') +
            parseEnv('REACT_APP_GPT4_8K_TOPK_5_AVG_TOKENS') +
            parseEnv('REACT_APP_GPT4_8K_TOPK_7_AVG_TOKENS')) /
          3
        );
      case '0.01': // GPT-4-Turbo-128K
        return (
          (parseEnv('REACT_APP_GPT4_TURBO_128K_TOPK_3_AVG_TOKENS') +
            parseEnv('REACT_APP_GPT4_TURBO_128K_TOPK_5_AVG_TOKENS') +
            parseEnv('REACT_APP_GPT4_TURBO_128K_TOPK_7_AVG_TOKENS')) /
          3
        );
      case '0.0015': // GPT-3.5-Turbo-Instruct-4K
        return (
          (parseEnv('REACT_APP_GPT3_5_TURBO_INSTRUCT_4K_TOPK_3_AVG_TOKENS') +
            parseEnv('REACT_APP_GPT3_5_TURBO_INSTRUCT_4K_TOPK_5_AVG_TOKENS') +
            parseEnv('REACT_APP_GPT3_5_TURBO_INSTRUCT_4K_TOPK_7_AVG_TOKENS')) /
          3
        );
      case '0.0005': // GPT-3.5-Turbo-0125-16K
        return (
          (parseEnv('REACT_APP_GPT3_5_TURBO_0125_16K_TOPK_3_AVG_TOKENS') +
            parseEnv('REACT_APP_GPT3_5_TURBO_0125_16K_TOPK_5_AVG_TOKENS') +
            parseEnv('REACT_APP_GPT3_5_TURBO_0125_16K_TOPK_7_AVG_TOKENS')) /
          3
        );
      default:
        return 5000; // Default value
    }
  };

  // Fetch average tokens from environment variables
  const getAverageOutputTokens = (model, topK) => {
    const parseEnv = (key) => parseFloat(process.env[key] || 5000);

    switch (model) {
      case '0.0600': // GPT-4-32K
        console.log("32")
        return (
          (parseEnv('REACT_APP_GPT4_32K_TOPK_3_AVG_OUTPUT_TOKENS') +
            parseEnv('REACT_APP_GPT4_32K_TOPK_5_AVG_OUTPUT_TOKENS') +
            parseEnv('REACT_APP_GPT4_32K_TOPK_7_AVG_OUTPUT_TOKENS')) /
          3
        );
      case '0.0300': // GPT-4-8K
        return (
          (parseEnv('REACT_APP_GPT4_8K_TOPK_3_AVG_OUTPUT_TOKENS') +
            parseEnv('REACT_APP_GPT4_8K_TOPK_5_AVG_OUTPUT_TOKENS') +
            parseEnv('REACT_APP_GPT4_8K_TOPK_7_AVG_OUTPUT_TOKENS')) /
          3
        );
      case '0.01': // GPT-4-Turbo-128K
        return (
          (parseEnv('REACT_APP_GPT4_TURBO_128K_TOPK_3_AVG_OUTPUT_TOKENS') +
            parseEnv('REACT_APP_GPT4_TURBO_128K_TOPK_5_AVG_OUTPUT_TOKENS') +
            parseEnv('REACT_APP_GPT4_TURBO_128K_TOPK_7_AVG_OUTPUT_TOKENS')) /
          3
        );
      case '0.0015': // GPT-3.5-Turbo-Instruct-4K
        return (
          (parseEnv('REACT_APP_GPT3_5_TURBO_INSTRUCT_4K_TOPK_3_AVG_OUTPUT_TOKENS') +
            parseEnv('REACT_APP_GPT3_5_TURBO_INSTRUCT_4K_TOPK_5_AVG_OUTPUT_TOKENS') +
            parseEnv('REACT_APP_GPT3_5_TURBO_INSTRUCT_4K_TOPK_7_AVG_OUTPUT_TOKENS')) /
          3
        );
      case '0.0005': // GPT-3.5-Turbo-0125-16K
        return (
          (parseEnv('REACT_APP_GPT3_5_TURBO_0125_16K_TOPK_3_AVG_TOKENS') +
            parseEnv('REACT_APP_GPT3_5_TURBO_0125_16K_TOPK_5_AVG_TOKENS') +
            parseEnv('REACT_APP_GPT3_5_TURBO_0125_16K_TOPK_7_AVG_TOKENS')) /
          3
        );
      default:
        return 5000; // Default value
    }
  };

   const calculateTokens = (avgWords, posts) => {
    const topK = 5; // Default Top K, or fetch this value based on user selection if needed
    const avgTokenBase = getAverageTokens(model, topK);
    return (avgTokenBase + (parseFloat(avgWords || 0) / 4) * parseInt(posts || 0)).toFixed(2);
  };  // Calculate Average No. of Tokens based on Avg Words and Posts

  const calculateOutputTokens = (avgWords2, posts) => {
    const topK = 5; // Default Top K, or fetch this value based on user selection if needed
    const avgTokenBase2 = getAverageOutputTokens(model, topK);
    return (avgTokenBase2 + (parseFloat(avgWords2 || 0) / 4) * parseInt(posts || 0)).toFixed(2);
  }

  // Handle model dropdown changes and trigger calculations
  const handleModelChange = (event) => {
    const newModel = event.target.value;
    setModel(newModel);
    updateAllCosts(newModel); // Update costs when model changes
  };

  // Update cost and tokens when input changes
  const handleInputChange = (index, field, value) => {
    const updatedSets = [...inputSets];
    updatedSets[index][field] = value;

    if (field === 'avgWords' || field === 'posts') {
      updatedSets[index].avgTokens = calculateTokens(updatedSets[index].avgWords, updatedSets[index].posts);
    }    // Update Avg Tokens when Avg Words or Posts change
    
    if (field === 'avgWords2' || field === 'posts') {
      updatedSets[index].avgTokens2 = calculateOutputTokens(updatedSets[index].avgWords2, updatedSets[index].posts);// Update Avg Tokens2 when Avg Words2 or Posts change
    }
    // Calculate cost whenever inputs are updated
    updatedSets[index].cost = calculateCost(updatedSets[index], model);
    setInputSets(updatedSets);
  };

  // Calculate cost based on Avg No of Tokens and selected model value
  const calculateCost = (data, modelValue) => {
    const avgTokens = parseFloat(data.avgTokens || 0);
    const avgTokens2 = parseFloat(data.avgTokens2 || 0);
    const avgIterations = parseFloat(data.avgIterations || 0);
    const modelCost = parseFloat(modelValue);
    return (((avgTokens + avgTokens2) / 1000) * modelCost * avgIterations).toFixed(2);
  };

  // Update all input sets' costs when the model changes
  const updateAllCosts = (modelValue) => {
    const updatedSets = inputSets.map((set) => ({
      ...set,
      cost: calculateCost(set, modelValue),
    }));
    setInputSets(updatedSets);
  };

  // Add new input set
  const handleAddInputSet = () => {
    if (inputSets.length < 5) {
      setInputSets([
        ...inputSets,
        { messageType: '', posts: '', avgWords: '', avgWords2: '', avgIterations: '', cost: '', avgTokens: '', avgTokens2: '' },
      ]);
      setSnackbarMessage('New input set added');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
    } else {
      setSnackbarMessage('Maximum of 5 input sets allowed');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  const messageTypes = [
    'Generate Social Media Post',
    'Generate Long-Form Content',
    'Generate Email Newsletter Content',
    'Generate Podcast Episode Outline',
    'Generate Report Content',
  ];

  const handleRemoveInputSet = (index) => {
    const updatedSets = inputSets.filter((_, i) => i !== index);
    setInputSets(updatedSets);
    setSnackbarMessage('Input set removed');
    setSnackbarSeverity('info');
    setOpenSnackbar(true);
  };
  const calculateTotalCost = () => {
    return inputSets.reduce((total, set) => total + parseFloat(set.cost || 0), 0).toFixed(2);
  };

  // Styled component for the footer row to enhance its visibility
const StyledTableFooterRow = styled(TableRow)({
  backgroundColor: 'rgb(237 247 237 / 87%)', // Light gray background
  fontWeight: 'bold',
});

// Function to format the cost as a currency
const formatCurrency = (value) => {
  return `$${parseFloat(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

  return (
    <>
      <style>
        {`
          .calculatorTitle {
            font-family: "Libre Baskerville", serif;
            font-weight: 400;
            font-style: normal;
            font-size: 1.5rem;
            color: white;
          }
          .totalCost{
            font-family: "Libre Baskerville", serif;
            font-size: 1rem;
          }
        `}
      </style>
      <AppBar position="static">
        <Toolbar>
          <Box display="flex" justifyContent="center" width="100%">
            <Typography variant="h6" className='calculatorTitle'>Azure Model Pricing Calculator</Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <Container style={{ marginTop: '50px' }}>
        <Box mb={3}>
          <FormControl variant="outlined" style={{ width: '70%' }}>
            <InputLabel id="model-label">Azure OpenAI Service - Model</InputLabel>
            <Select labelId="model-label" value={model} onChange={handleModelChange} label="Azure OpenAI Service - Model">
              <MenuItem value="0.0600">GPT-4-32K</MenuItem>
              <MenuItem value="0.0300">GPT-4-8K</MenuItem>
              <MenuItem value="Pricing not available">GPT-4-Turbo-128K</MenuItem>
              <MenuItem value="0.0015">GPT-3.5-Turbo-Instruct-4K</MenuItem>
              <MenuItem value="NA">GPT-3.5-Turbo-0125-16K</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <TableContainer component={Paper} style={{ marginBottom: '20px', overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ minWidth: 100 }}>Message Type</TableCell>
                <TableCell style={{ minWidth: 100 }}>No of Posts In a Month</TableCell>
                <TableCell style={{ minWidth: 100 }}>Avg No of Words (Input)</TableCell>
                <TableCell style={{ minWidth: 100 }}>Avg No of Tokens (Input)</TableCell>
                <TableCell style={{ minWidth: 100 }}>Avg No of Words (Output)</TableCell>
                <TableCell style={{ minWidth: 100 }}>Avg No of Tokens (Output)</TableCell>
                <TableCell style={{ minWidth: 100 }}>Avg No of Iterations</TableCell>
                <TableCell style={{ minWidth: 100 }}>Cost (in $)</TableCell>
                <TableCell style={{ minWidth: 60 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inputSets.map((set, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <FormControl fullWidth variant="outlined" size="small">
                      <InputLabel>Message Type</InputLabel>
                      <Select
                        value={set.messageType}
                        onChange={(e) => handleInputChange(index, 'messageType', e.target.value)}
                        label="Message Type"
                      >
                        {messageTypes.map((type, i) => (
                          <MenuItem key={i} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={set.posts}
                      onChange={(e) => handleInputChange(index, 'posts', e.target.value)}
                      variant="outlined"
                      size="small"
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={set.avgWords}
                      onChange={(e) => handleInputChange(index, 'avgWords', e.target.value)}
                      variant="outlined"
                      size="small"
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={set.avgTokens}
                      onChange={(e) => handleInputChange(index, 'avgTokens', e.target.value)}
                      variant="outlined"
                      size="small"
                      fullWidth
                      disabled
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={set.avgWords2}
                      onChange={(e) => handleInputChange(index, 'avgWords2', e.target.value)}
                      variant="outlined"
                      size="small"
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={set.avgTokens2}
                      onChange={(e) => handleInputChange(index, 'avgTokens2', e.target.value)}
                      variant="outlined"
                      size="small"
                      fullWidth
                      disabled
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={set.avgIterations}
                      onChange={(e) => handleInputChange(index, 'avgIterations', e.target.value)}
                      variant="outlined"
                      size="small"
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={set.cost}
                      variant="outlined"
                      size="small"
                      fullWidth
                      disabled
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleRemoveInputSet(index)}>
                      <RemoveCircleOutlineIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
          <StyledTableFooterRow>
            <TableCell colSpan={7} align="right">
              <strong> <h3 className='totalCost' >Total Cost:</h3> </strong>
            </TableCell>
            <TableCell>
              <TextField
                type="text"
                value={formatCurrency(calculateTotalCost())}
                variant="outlined"
                size="small"
                fullWidth
                disabled
                inputProps={{ style: { fontWeight: 'bold', textAlign: 'right' } }}
              />
            </TableCell>
            <TableCell></TableCell>
          </StyledTableFooterRow>
        </TableFooter>
          </Table>
        </TableContainer>

        <Box display="flex" justifyContent="flex-end" mb={3}>
          <Button variant="contained" color="primary" onClick={handleAddInputSet}  sx={{ textTransform: 'none' }} >
            <AddIcon /> Add Row
          </Button>
        </Box>
      </Container>
      <Snackbar open={openSnackbar} autoHideDuration={1000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default GenAIPricing;
