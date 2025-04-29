import { useState, useEffect } from 'react';
import axios from 'axios';
import "./style.css";
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import {
  Typography, Button, Select, MenuItem, SelectChangeEvent,
  FormControl, FormLabel
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// Interface for data from backend
interface Personality {
  id: number;
  name: string;
  place: string;
  records: string;
  description: string;
  url: string;
  alt: string;
}

export default function Gallery() {
  const [sculptureList, setSculptureList] = useState<Personality[]>([]);
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);

  // Fetch from backend
  useEffect(() => {
    axios.get('http://localhost:8080/guarin/personalities')
      .then(res => setSculptureList(res.data))
      .catch(err => console.error("Failed to fetch personalities:", err));
  }, []);

  const handleNextClick = () => {
    if (index < sculptureList.length - 1) {
      setIndex(index + 1);
    }
  };

  const handleBackClick = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  const handleMoreClick = () => {
    setShowMore(!showMore);
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const selectedIndex = sculptureList.findIndex(s => s.name === event.target.value);
    if (selectedIndex !== -1) {
      setIndex(selectedIndex);
    }
  };

  if (sculptureList.length === 0) {
    return (
      <Container maxWidth="sm">
        <Typography variant="h6" align="center">No available personalities.</Typography>
      </Container>
    );
  }

  const sculpture = sculptureList[index];

  return (
    <Container maxWidth="sm" sx={{ width: '600px', margin: '0 auto' }}>
      <Box component="section" sx={{ p: 2, border: '1px solid gray' }}>
        <Typography variant="h2" component="h2" gutterBottom>
          SHAWN ASHLEE GUARIN - CPEITEL3
        </Typography>

        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="contained"
            onClick={handleNextClick}
            color="primary"
            startIcon={<ArrowForwardIosIcon />}
            disabled={index === sculptureList.length - 1}
          >
            <Typography variant="h6">NEXT</Typography>
          </Button>
          <Button
            onClick={handleBackClick}
            variant="contained"
            color="primary"
            startIcon={<ArrowBackIosNewIcon />}
            disabled={index === 0}
          >
            <Typography variant="h6">BACK</Typography>
          </Button>
        </Stack>

        <Typography variant="h4" fontWeight="bold" paddingTop={4}>
          {sculpture.name}
        </Typography>

        <Typography variant="h6" fontSize={16}>
          {sculpture.place} <br />
          {sculpture.records}
        </Typography>

        <Typography variant="h6" fontSize={12} paddingTop={3}>
          ({index + 1} of {sculptureList.length})
        </Typography>

        <Button
          onClick={handleMoreClick}
          sx={{
            margin: '5px',
            backgroundColor: 'green',
            color: 'white',
            '&:hover': {
              backgroundColor: 'darkgreen',
            },
          }}
        >
          {showMore ? 'Hide' : 'Show'} details
        </Button>

        {showMore && <Typography variant="body1">{sculpture.description}</Typography>}

        <img
          src={sculpture.url}
          alt={sculpture.alt}
          style={{ maxWidth: "100%", marginTop: "10px" }}
        />

        <SelectComponent
          sculptureList={sculptureList}
          index={index}
          onChange={handleSelectChange}
        />
      </Box>
    </Container>
  );
}

function SelectComponent({
  sculptureList,
  index,
  onChange
}: {
  sculptureList: Personality[];
  index: number;
  onChange: (event: SelectChangeEvent<string>) => void;
}) {
  return (
    <FormControl sx={{ m: 1, minWidth: 250 }} size="small">
      <FormLabel>Select a personality</FormLabel>
      <Select value={sculptureList[index].name} onChange={onChange}>
        {sculptureList.map((s, i) => (
          <MenuItem key={s.id} value={s.name}>
            {s.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
