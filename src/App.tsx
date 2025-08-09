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
    TextField,
    InputAdornment,
    CircularProgress,
    Alert,
    Snackbar,
    Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import AddRecordModal from './AddRecordModal';
import EditRecordModal from './EditRecordModal';
import { getAllRecords, addRecord, updateRecord, deleteRecord, RecordData } from './firebaseService';
import { testFirebaseConnection } from './testFirebase';

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
        fontFamily: '"Lao SomVang", "Inter", "Roboto", "Arial", sans-serif',
        h6: {
            fontWeight: 600,
        },
    },
});

function App() {
    const [filter, setFilter] = useState<string>('');
    const [ownerFilter, setOwnerFilter] = useState<string>('All');
    const [recordData, setRecordData] = useState<RecordData[]>([]);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
    const [selectedRecord, setSelectedRecord] = useState<RecordData | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    // Load data from Firebase when component mounts
    useEffect(() => {
        loadRecords();
        // ทดสอบการเชื่อมต่อ Firebase
        testFirebaseConnection();
    }, []);

    const loadRecords = async () => {
        try {
            setLoading(true);
            console.log('🔄 กำลังโหลดข้อมูลจาก Firebase...');
            const records = await getAllRecords();
            console.log('📊 ข้อมูลที่ได้:', records);
            console.log('📈 จำนวนข้อมูล:', records.length);
            setRecordData(records);
            setError('');
        } catch (err) {
            console.error('❌ Error loading records:', err);
            setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (event: SelectChangeEvent) => {
        setFilter(event.target.value);
    };

    const handleOwnerFilterChange = (event: SelectChangeEvent) => {
        setOwnerFilter(event.target.value);
    };

    const handleAddClick = () => {
        setModalOpen(true);
    };

    const handleAddRecord = async (recordData: Omit<RecordData, 'id' | 'createdAt' | 'updatedAt'>) => {
        try {
            await addRecord(recordData);
            await loadRecords(); // Reload data from Firebase
            setSuccess('ເພີ່ມຂໍ້ມູນສຳເລັດແລ້ວ');
        } catch (err) {
            console.error('Error adding record:', err);
            setError('ເກີດຂໍ້ຜິດພາດໃນການເພີ່ມຂໍ້ມູນ');
        }
    }; const handleCardClick = (record: RecordData) => {
        setSelectedRecord(record);
        setEditModalOpen(true);
    };

    const handleSaveEdit = async (updatedRecord: RecordData) => {
        try {
            // ใช้ Firebase document ID สำหรับการอัปเดต
            const documentId = selectedRecord?.id;
            if (documentId) {
                await updateRecord(documentId, updatedRecord);
                await loadRecords(); // Reload data from Firebase
                setSuccess('ອັບເດດຂໍ້ມູນສຳເລັດແລ້ວ');
            }
            setEditModalOpen(false);
            setSelectedRecord(null);
        } catch (err) {
            console.error('Error updating record:', err);
            setError('ເກີດຂໍ້ຜິດພາດໃນການອັບເດດຂໍ້ມູນ');
        }
    };

    const handleDeleteRecord = async (recordId: string) => {
        try {
            await deleteRecord(recordId);
            await loadRecords(); // Reload data from Firebase
            setSuccess('ລົບຂໍ້ມູນສຳເລັດແລ້ວ');
            setEditModalOpen(false);
            setSelectedRecord(null);
        } catch (err) {
            console.error('Error deleting record:', err);
            setError('ເກີດຂໍ້ຜິດພາດໃນການລົບຂໍ້ມູນ');
        }
    };

    // กรองข้อมูลตามการค้นหา, status และ owner
    const filteredRecordData = recordData.filter(record => {
        const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesOwner = ownerFilter === 'All' || record.owner === ownerFilter;
        const matchesStatus = filter === '' || record.status === filter;

        return matchesSearch && matchesOwner && matchesStatus;
    });

    // Debug ข้อมูล
    console.log('🔍 Debug Info:');
    console.log('📊 recordData:', recordData);
    console.log('📈 recordData.length:', recordData.length);
    console.log('🔎 filteredRecordData:', filteredRecordData);
    console.log('📉 filteredRecordData.length:', filteredRecordData.length);
    console.log('🔄 loading:', loading);
    console.log('❌ error:', error);

    // แสดงหน้าทดสอบ Firebase ถ้าต้องการ
    // (ลบส่วนนี้ออกแล้ว)

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
                            SSV Farm
                        </Typography>

                        {/* Search Input */}
                        <TextField
                            placeholder="ຄົ້ນຫາ..."
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
                    {/* Loading State */}
                    {loading && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <CircularProgress sx={{ color: '#64b5f6' }} />
                        </Box>
                    )}

                    {/* Error State */}
                    {error && (
                        <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
                            {error}
                        </Alert>
                    )}

                    {/* Success State */}
                    {success && (
                        <Alert severity="success" sx={{ mb: 3, borderRadius: '12px' }}>
                            {success}
                        </Alert>
                    )}

                    {!loading && (
                        <>
                            {/* Filter Dropdown */}
                            <Box sx={{ mb: 3 }}>
                                <FormControl fullWidth size="small">
                                    <InputLabel id="filter-label" sx={{ color: '#b0b3c7', fontSize: '0.9rem', fontWeight: 500 }}>
                                        ຕົວກອງ
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
                                        <MenuItem value="" sx={{ fontSize: '0.9rem' }}>ທັງໝົດ</MenuItem>
                                        <MenuItem value="ປະສົມ" sx={{ fontSize: '0.9rem' }}>ປະສົມ</MenuItem>
                                        <MenuItem value="ຖືພາ" sx={{ fontSize: '0.9rem' }}>ຖືພາ</MenuItem>
                                        <MenuItem value="ລ້ຽງລູກ" sx={{ fontSize: '0.9rem' }}>ລ້ຽງລູກ</MenuItem>
                                        <MenuItem value="ພັກຟື້ນ" sx={{ fontSize: '0.9rem' }}>ພັກຟື້ນ</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                            <Box sx={{ mb: 3 }}>
                                <FormControl fullWidth size="small">
                                    <InputLabel id="owner-label" sx={{ color: '#b0b3c7', fontSize: '0.9rem', fontWeight: 500 }}>
                                        ເຈົ້າຂອງ
                                    </InputLabel>
                                    <Select
                                        labelId="owner-label"
                                        value={ownerFilter}
                                        label="Owner Filter"
                                        onChange={handleOwnerFilterChange}
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
                                        <MenuItem value="All" sx={{ fontSize: '0.9rem' }}>All</MenuItem>
                                        <MenuItem value="Tay" sx={{ fontSize: '0.9rem' }}>Tay</MenuItem>
                                        <MenuItem value="Ter" sx={{ fontSize: '0.9rem' }}>Ter</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>

                            {/* Data Grid */}
                            <Grid container spacing={2}>
                                {filteredRecordData.map((record, index) => (
                                    <Grid item xs={6} key={index}>
                                        <Card
                                            onClick={() => handleCardClick(record)}
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
                                                    ຊື່
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
                                                        mb: 1,
                                                    }}
                                                >
                                                    {record.name}
                                                </Typography>
                                                {record.status && (
                                                    <Chip
                                                        label={record.status}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor:
                                                                record.status === 'ປະສົມ' ? '#ff9800' :
                                                                    record.status === 'ຖືພາ' ? '#4caf50' :
                                                                        record.status === 'ລ້ຽງລູກ' ? '#2196f3' :
                                                                            record.status === 'ພັກຟື້ນ' ? '#e91e63' :
                                                                                '#616161',
                                                            color: 'white',
                                                            fontSize: '0.7rem',
                                                            fontWeight: 'bold',
                                                            height: '20px',
                                                        }}
                                                    />
                                                )}
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
                                        ບໍ່ພົບຂໍ້ມູນຕາມຄຳຄົ້ນຫາ:
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
                        </>
                    )}
                </Container>

                {/* Floating Action Button - แสดงอยู่ตลอดเวลา */}
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

                {/* Snackbar for notifications */}
                <Snackbar
                    open={!!success}
                    autoHideDuration={6000}
                    onClose={() => setSuccess('')}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert onClose={() => setSuccess('')} severity="success" sx={{ width: '100%' }}>
                        {success}
                    </Alert>
                </Snackbar>

                <Snackbar
                    open={!!error}
                    autoHideDuration={6000}
                    onClose={() => setError('')}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
                        {error}
                    </Alert>
                </Snackbar>

                {/* Add Record Modal */}
                <AddRecordModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onAdd={handleAddRecord}
                />

                {/* Edit Record Modal */}
                <EditRecordModal
                    open={editModalOpen}
                    onClose={() => {
                        setEditModalOpen(false);
                        setSelectedRecord(null);
                    }}
                    onSave={handleSaveEdit}
                    onDelete={handleDeleteRecord}
                    recordData={selectedRecord}
                />
            </div>
        </ThemeProvider>
    );
}

export default App;
