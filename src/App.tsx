import React, { useState, useEffect } from 'react';
import {
    ThemeProvider,
    createTheme,
    CssBaseline,
    AppBar,
    Toolbar,
    Typography,
    Container,
    Grid,
    Card,
    CardContent,
    Fab,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
    Box,
    Fade,
    TextField,
    InputAdornment
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import AddRecordModal from './AddRecordModal';

// สร้างธีมมืดที่หรูหรา
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#64b5f6',
        },
        secondary: {
            main: '#ff7043',
        },
        background: {
            default: '#0a0e27',
            paper: '#1a1d3a',
        },
        text: {
            primary: '#ffffff',
            secondary: '#b0b3c7',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Arial", sans-serif',
        h6: {
            fontWeight: 600,
        },
    },
});

// ข้อมูลตัวอย่าง
const initialRecordData = [
    { id: 'A00001', status: 'active' },
    { id: 'A00002', status: 'active' },
    { id: 'A00003', status: 'active' },
    { id: 'A00004', status: 'active' },
    { id: 'A00005', status: 'active' },
    { id: 'A00006', status: 'active' },
    { id: 'A00007', status: 'active' },
    { id: 'A00008', status: 'active' },
    { id: 'A00009', status: 'active' },
    { id: 'A00010', status: 'active' },
    { id: 'A00011', status: 'active' },
    { id: 'A00012', status: 'active' },
    { id: 'A00013', status: 'active' },
    { id: 'A00014', status: 'active' },
    { id: 'A00015', status: 'active' },
    { id: 'A00016', status: 'active' },
    { id: 'A00017', status: 'active' },
    { id: 'A00018', status: 'active' },
    { id: 'A00019', status: 'active' },
    { id: 'A00020', status: 'active' },
    { id: 'A00021', status: 'active' },
    { id: 'A00022', status: 'active' },
    { id: 'A00023', status: 'active' },
    { id: 'A00024', status: 'active' },
    { id: 'A00025', status: 'active' },
    { id: 'A00026', status: 'active' },
    { id: 'A00027', status: 'active' },
    { id: 'A00028', status: 'active' },
    { id: 'A00029', status: 'active' },
    { id: 'A00030', status: 'active' },
];

function App() {
    const [filter, setFilter] = useState<string>('ข้อมูลระบบ');
    const [isVisible, setIsVisible] = useState<boolean>(true);
    const [lastScrollY, setLastScrollY] = useState<number>(0);
    const [recordData, setRecordData] = useState(initialRecordData);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');

    // จัดการการเลื่อนหน้าจอเพื่อซ่อน/แสดงปุ่ม FAB
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // เลื่อนลง
                setIsVisible(false);
            } else {
                // เลื่อนขึ้น
                setIsVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    const handleFilterChange = (event: SelectChangeEvent) => {
        setFilter(event.target.value);
    };

    const handleAddClick = () => {
        setModalOpen(true);
    };

    const handleAddRecord = (recordId: string) => {
        const newRecord = { id: recordId, status: 'active' };
        setRecordData(prev => [newRecord, ...prev]);
    };

    // กรองข้อมูลตามการค้นหา
    const filteredRecordData = recordData.filter(record =>
        record.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <div style={{ 
                minHeight: '100vh', 
                background: 'linear-gradient(135deg, #0a0e27 0%, #1a1d3a 50%, #2d1b69 100%)',
            }}>
                {/* Header with Search */}
                <AppBar 
                    position="sticky" 
                    sx={{ 
                        background: 'linear-gradient(135deg, #1a1d3a 0%, #2d1b69 100%)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                        border: '1px solid rgba(255,255,255,0.1)',
                    }}
                >
                    <Toolbar sx={{ flexDirection: 'column', py: 3 }}>
                        <Typography 
                            variant="h6" 
                            component="div" 
                            sx={{ 
                                mb: 3, 
                                textAlign: 'center', 
                                fontSize: '1.3rem',
                                fontWeight: 700,
                                background: 'linear-gradient(45deg, #64b5f6 30%, #ff7043 90%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                textShadow: '0 0 20px rgba(100, 181, 246, 0.3)',
                            }}
                        >
                            ค้นหาข้อมูล
                        </Typography>

                        {/* Search Input */}
                        <TextField
                            placeholder="ค้นหารหัสข้อมูล..."
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: '#64b5f6', fontSize: '1.3rem' }} />
                                    </InputAdornment>
                                ),
                                sx: {
                                    background: 'linear-gradient(135deg, rgba(26, 29, 58, 0.8) 0%, rgba(45, 27, 105, 0.8) 100%)',
                                    backdropFilter: 'blur(20px)',
                                    color: '#ffffff',
                                    fontSize: '0.95rem',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(100, 181, 246, 0.3)',
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'rgba(100, 181, 246, 0.3)',
                                        borderWidth: '1px',
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#64b5f6',
                                        boxShadow: '0 0 20px rgba(100, 181, 246, 0.3)',
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#64b5f6',
                                        boxShadow: '0 0 25px rgba(100, 181, 246, 0.4)',
                                    },
                                    '& input::placeholder': {
                                        color: '#b0b3c7',
                                        opacity: 1,
                                    },
                                }
                            }}
                            sx={{ maxWidth: '400px' }}
                        />
                    </Toolbar>
                </AppBar>

                <Container maxWidth="sm" sx={{ px: 1.5, py: 2, paddingBottom: '80px' }}>
                    {/* Filter Dropdown */}
                    <Box sx={{ mb: 3 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel id="filter-label" sx={{ color: '#b0b3c7', fontSize: '0.9rem', fontWeight: 500 }}>
                                ตัวกรอง
                            </InputLabel>
                            <Select
                                labelId="filter-label"
                                value={filter}
                                label="ตัวกรอง"
                                onChange={handleFilterChange}
                                sx={{
                                    background: 'linear-gradient(135deg, rgba(26, 29, 58, 0.9) 0%, rgba(45, 27, 105, 0.9) 100%)',
                                    backdropFilter: 'blur(20px)',
                                    fontSize: '0.9rem',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(100, 181, 246, 0.2)',
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'rgba(100, 181, 246, 0.2)',
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#64b5f6',
                                        boxShadow: '0 0 15px rgba(100, 181, 246, 0.2)',
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#64b5f6',
                                        boxShadow: '0 0 20px rgba(100, 181, 246, 0.3)',
                                    },
                                    '& .MuiSelect-icon': {
                                        color: '#64b5f6',
                                    },
                                }}
                            >
                                <MenuItem value="ข้อมูลระบบ" sx={{ fontSize: '0.9rem' }}>ข้อมูลระบบ</MenuItem>
                                <MenuItem value="รายการทั้งหมด" sx={{ fontSize: '0.9rem' }}>รายการทั้งหมด</MenuItem>
                                <MenuItem value="รายการใหม่" sx={{ fontSize: '0.9rem' }}>รายการใหม่</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    {/* Data Grid */}
                    <Grid container spacing={2}>
                        {filteredRecordData.map((record, index) => (
                            <Grid item xs={6} key={index}>
                                <Card
                                    sx={{
                                        background: 'linear-gradient(135deg, rgba(26, 29, 58, 0.8) 0%, rgba(45, 27, 105, 0.8) 100%)',
                                        backdropFilter: 'blur(20px)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '16px',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        '&:hover': {
                                            transform: 'translateY(-8px) scale(1.02)',
                                            boxShadow: '0 20px 40px rgba(100, 181, 246, 0.2)',
                                            border: '1px solid rgba(100, 181, 246, 0.3)',
                                            cursor: 'pointer',
                                            '&::before': {
                                                opacity: 1,
                                            }
                                        },
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            background: 'linear-gradient(45deg, rgba(100, 181, 246, 0.1) 0%, rgba(255, 112, 67, 0.1) 100%)',
                                            opacity: 0,
                                            transition: 'opacity 0.3s ease',
                                        },
                                        transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
                                        minHeight: '100px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <CardContent sx={{ 
                                        py: 3, 
                                        px: 2.5, 
                                        '&:last-child': { pb: 3 }, 
                                        textAlign: 'center', 
                                        width: '100%',
                                        position: 'relative',
                                        zIndex: 1,
                                    }}>
                                        <Typography 
                                            variant="body2" 
                                            sx={{ 
                                                color: '#b0b3c7', 
                                                fontSize: '0.75rem', 
                                                mb: 1,
                                                fontWeight: 500,
                                                letterSpacing: '0.5px',
                                                textTransform: 'uppercase',
                                            }}
                                        >
                                            รหัส
                                        </Typography>
                                        <Typography 
                                            variant="h6" 
                                            sx={{ 
                                                background: 'linear-gradient(45deg, #4caf50 30%, #66bb6a 90%)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                backgroundClip: 'text',
                                                fontSize: '1rem', 
                                                fontWeight: 700,
                                                letterSpacing: '1px',
                                                textShadow: '0 0 15px rgba(76, 175, 80, 0.3)',
                                            }}
                                        >
                                            {record.id}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {/* No Results Message */}
                    {filteredRecordData.length === 0 && searchTerm && (
                        <Box sx={{ textAlign: 'center', mt: 6 }}>
                            <Typography 
                                variant="body1" 
                                sx={{ 
                                    color: '#b0b3c7', 
                                    fontSize: '1rem',
                                    fontWeight: 500,
                                    mb: 1,
                                }}
                            >
                                ไม่พบข้อมูลที่ค้นหา
                            </Typography>
                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    color: '#64b5f6', 
                                    fontSize: '0.9rem',
                                    fontStyle: 'italic',
                                }}
                            >
                                "{searchTerm}"
                            </Typography>
                        </Box>
                    )}
                </Container>

                {/* Floating Action Button - จะติดตามการเลื่อนหน้าจอ */}
                <Fade in={isVisible}>
                    <Fab
                        aria-label="add"
                        onClick={handleAddClick}
                        sx={{
                            position: 'fixed',
                            bottom: 24,
                            right: 24,
                            width: 64,
                            height: 64,
                            background: 'linear-gradient(45deg, #64b5f6 30%, #ff7043 90%)',
                            border: '2px solid rgba(255, 255, 255, 0.2)',
                            backdropFilter: 'blur(20px)',
                            boxShadow: '0 8px 32px rgba(100, 181, 246, 0.3)',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #42a5f5 30%, #ff5722 90%)',
                                transform: 'scale(1.1) rotate(90deg)',
                                boxShadow: '0 12px 40px rgba(100, 181, 246, 0.4)',
                            },
                            '&:active': {
                                transform: 'scale(0.95) rotate(90deg)',
                            },
                            zIndex: 1000,
                            transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
                        }}
                    >
                        <AddIcon sx={{ fontSize: 28, color: '#ffffff', fontWeight: 'bold' }} />
                    </Fab>
                </Fade>

                {/* Add Record Modal */}
                <AddRecordModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onAdd={handleAddRecord}
                />
            </div>
        </ThemeProvider>
    );
}

export default App;
