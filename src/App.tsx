import { useState, type FormEvent} from 'react';
import { Container, Box, Typography, TextField, Button, Snackbar } from '@mui/material';

import SendIcon from '@mui/icons-material/Send';

import { AlignmentViewer } from './AlignmentViewer';
function validateAminoAcidSeq(seq: string): string | null {
  if(seq.length === 0) {
    return 'Заполните последовательность'
  }
  if (!/^[A-Za-z -]*$/.test(seq)) {
    return 'Только латинские буквы допустимы';
  }
  if (!/^[ACDEFGHIKLMNPQRSTVWY-]*$/i.test(seq)) {
    return 'В строке есть недопустимые аминокислоты';
  }
  return null;
}

function App() {
  const [data, setData] = useState({
    input1: '',
    input2: '',
  });
  const [errors, setErrors] = useState<Record<string, string | null>>({
    input1: null,
    input2: null,
  });
  const [showViewer, setShowViewer] = useState(false)

  const [snackOpen, setSnackOpen] = useState(false);

  // функция, которую мы передадим в AlignmentViewer:
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setSnackOpen(true);
  };


  console.log(data, errors, '😍');

  function handelDatas(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value.toUpperCase() }));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // const {name, value} = e.target;
    const err1 = validateAminoAcidSeq(data.input1);
    const err2 = validateAminoAcidSeq(data.input2);

          if(data.input1.length !== data.input2.length && err1 === null && err2=== null) {
        setErrors({ input1: "Длины последовательностей должны совпадать.", input2: "Длины последовательностей должны совпадать." })
      } else {
        setErrors({ input1: err1, input2: err2 });
      }
    


    if (!err1 && !err2 && data.input1.length === data.input2.length) {
       console.log('Данные корректны');
      // if(data.input1.length !== data.input2.length) {
      //   setErrors({ input1: "Длины последовательностей должны совпадать.", input2: "Длины последовательностей должны совпадать." })
      // }
      setShowViewer(true)
    } else {
      console.log('Данные не корректны');
      setShowViewer(false)
    }
  }

  return (
    <Container maxWidth="sm"
    sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
    >
      <Box textAlign="center" mt={6} mb={3}>
        <Typography style={{ color: 'blue' }}> Insert your Amino</Typography>
      </Box>

      <Box
        style={{ display: 'flex' }}
        component="form"
        onSubmit={(e) => handleSubmit(e)}
      >
        <Box mb={2} marginLeft='1rem'>
          <TextField
            label="Последовательность 2"
            name="input1"
            onChange={(e) => handelDatas(e)}
            helperText={errors.input1}
            error={!!errors.input1}
            InputLabelProps={{ style: { fontSize: '0.9rem' } }}
            FormHelperTextProps={{
              style: { color: '#ff4081', fontSize: '0.875rem' },
            }}
          ></TextField>
        </Box>
        <Box  mb={2} marginLeft='1rem'>
          <TextField
            label="Последовательность 1"
            name="input2"
            onChange={(e) => handelDatas(e)}
            helperText={errors.input2}
            error={!!errors.input2}

            InputLabelProps={{ style: { fontSize: '0.9rem' } }}
            FormHelperTextProps={{
              style: { color: '#ff4081', fontSize: '0.875rem' },
            }}
          ></TextField>
        </Box>

        <Box margin="0.7rem 0rem 0rem 1rem" >
          <Button type="submit" variant="contained" endIcon={<SendIcon />} />
        </Box>
      </Box>
      <AlignmentViewer
      seq1 = {data.input1}
      seq2 = {data.input2}
      showViewer = {showViewer}
      onCopy={handleCopy}   
      />
      <Snackbar
        open={snackOpen}
        message="Скопировано в буфер"
        autoHideDuration={1000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Container>
  );
}

export default App;
