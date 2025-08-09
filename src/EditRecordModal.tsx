import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Typography,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Stack,
    InputAdornment,
    Popover,
    Grid,
    Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { RecordData } from './firebaseService';

interface EditRecordModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (recordData: RecordData) => void;
    onDelete?: (recordId: string) => void;
    recordData: RecordData | null;
}

// Helper function to format today's date as DD/MM/YYYY
const getTodayFormatted = (): string => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
};

const EditRecordModal: React.FC<EditRecordModalProps> = ({ open, onClose, onSave, onDelete, recordData }) => {
    const [recordName, setRecordName] = useState<string>('');
    const [status, setStatus] = useState<string>('');
    const [owner, setOwner] = useState<string>('');
    const [birthDate, setBirthDate] = useState<string>('');
    const [breedingDate, setBreedingDate] = useState<string>('');
    const [separationDate, setSeparationDate] = useState<string>('');
    const [estrusDate, setEstrusDate] = useState<string>('');
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);

    // Calendar state
    const [calendarOpen, setCalendarOpen] = useState<boolean>(false);
    const [calendarAnchor, setCalendarAnchor] = useState<HTMLElement | null>(null);
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
    const [activeDateSetter, setActiveDateSetter] = useState<((date: string) => void) | null>(null);

    // Load data when modal opens
    useEffect(() => {
        if (open && recordData) {
            setRecordName(recordData.name);
            setStatus(recordData.status || '');
            setOwner(recordData.owner);
            setBirthDate(recordData.birthDate || getTodayFormatted());
            setBreedingDate(recordData.breedingDate || '');
            setSeparationDate(recordData.separation_date || '');
            setEstrusDate(recordData.estrus_date || '');
        }
    }, [open, recordData]);

    const handleSubmit = () => {
        if (recordName.trim()) {
            const updatedData: RecordData = {
                id: recordData?.id, // Keep the Firebase document ID
                name: recordName.trim(),
                status: status,
                owner,
                breedingDate,
                birthDate,
                separation_date: separationDate,
                estrus_date: estrusDate
            };
            onSave(updatedData);
            onClose();
        }
    };

    const handleDelete = () => {
        if (recordData?.id && onDelete) {
            onDelete(recordData.id);
            setDeleteConfirmOpen(false);
            onClose();
        }
    };

    const handleDeleteClick = () => {
        setDeleteConfirmOpen(true);
    };

    const handleClose = () => {
        // Reset form
        setRecordName('');
        setStatus('');
        setOwner('');
        setBirthDate('');
        setBreedingDate('');
        setSeparationDate('');
        setEstrusDate('');
        setDeleteConfirmOpen(false);
        onClose();
    };

    // Validate and format DD/MM/YYYY input
    const handleDateChange = (value: string, setter: (date: string) => void) => {
        // Remove any non-digit characters except /
        let cleaned = value.replace(/[^\d/]/g, '');

        // Auto-add slashes
        if (cleaned.length >= 2 && cleaned.indexOf('/') === -1) {
            cleaned = cleaned.substring(0, 2) + '/' + cleaned.substring(2);
        }
        if (cleaned.length >= 5 && cleaned.split('/').length === 2) {
            const parts = cleaned.split('/');
            cleaned = parts[0] + '/' + parts[1] + '/' + cleaned.substring(5);
        }

        // Limit to DD/MM/YYYY format
        if (cleaned.length <= 10) {
            setter(cleaned);
        }
    };

    // Check if date string is valid DD/MM/YYYY format
    const isValidDate = (dateStr: string): boolean => {
        const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        const match = dateStr.match(regex);
        if (!match) return false;

        const day = parseInt(match[1], 10);
        const month = parseInt(match[2], 10);
        const year = parseInt(match[3], 10);

        const date = new Date(year, month - 1, day);
        return date.getDate() === day &&
            date.getMonth() === month - 1 &&
            date.getFullYear() === year;
    };

    // Open custom date picker
    const openDatePicker = (currentDate: string, setter: (date: string) => void, event: React.MouseEvent<HTMLButtonElement>) => {
        setCalendarAnchor(event.currentTarget);
        setActiveDateSetter(() => setter);
        setCalendarOpen(true);

        // Set current month based on the current date value
        if (isValidDate(currentDate)) {
            const [day, month, year] = currentDate.split('/');
            setCurrentMonth(new Date(parseInt(year), parseInt(month) - 1, parseInt(day)));
        }
    };

    // Generate calendar days
    const generateCalendarDays = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const days = [];
        const today = new Date();

        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);

            const isCurrentMonth = date.getMonth() === month;
            const isToday = date.toDateString() === today.toDateString();
            const dayStr = String(date.getDate()).padStart(2, '0');
            const monthStr = String(date.getMonth() + 1).padStart(2, '0');
            const yearStr = date.getFullYear().toString();
            const dateStr = `${dayStr}/${monthStr}/${yearStr}`;

            days.push({
                date: date,
                day: date.getDate(),
                isCurrentMonth,
                isToday,
                dateString: dateStr
            });
        }

        return days;
    };

    // Handle date selection
    const handleDateSelect = (dateString: string) => {
        if (activeDateSetter) {
            activeDateSetter(dateString);
        }
        setCalendarOpen(false);
        setCalendarAnchor(null);
        setActiveDateSetter(null);
    };

    // Navigate month
    const navigateMonth = (direction: number) => {
        setCurrentMonth(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + direction);
            return newDate;
        });
    };

    // Month names in Thai/Lao
    const monthNames = [
        'ມັງກອນ', 'ກຸມພາ', 'ມີນາ', 'ເມສາ', 'ພຶດສະພາ', 'ມິຖຸນາ',
        'ກໍລະກົດ', 'ສິງຫາ', 'ກັນຍາ', 'ຕຸລາ', 'ພະຈິກ', 'ທັນວາ'
    ];

    const dayNames = ['ອາທິດ', 'ຈັນ', 'ອັງຄານ', 'ພຸດ', 'ພະຫັດ', 'ສຸກ', 'ເສົາ'];

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    background: 'linear-gradient(135deg, rgba(26, 29, 58, 0.95) 0%, rgba(45, 27, 105, 0.95) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(100, 181, 246, 0.2)',
                    borderRadius: '20px',
                    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
                    margin: 2,
                    maxHeight: 'calc(100vh - 64px)',
                    color: '#ffffff',
                },
            }}
        >
            <DialogTitle sx={{
                background: 'linear-gradient(135deg, rgba(100, 181, 246, 0.1) 0%, rgba(255, 112, 67, 0.1) 100%)',
                borderBottom: '1px solid rgba(100, 181, 246, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                pb: 2,
                pt: 3,
            }}>
                <Typography
                    variant="h6"
                    sx={{
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        background: 'linear-gradient(45deg, #64b5f6 30%, #ff7043 90%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}
                >
                    ແກ້ໄຂຂໍ້ມູນ
                </Typography>
                <IconButton
                    onClick={handleClose}
                    sx={{
                        color: '#b0b3c7',
                        '&:hover': {
                            background: 'rgba(100, 181, 246, 0.1)',
                            color: '#64b5f6',
                        }
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ py: 3 }}>
                <Stack spacing={3} sx={{ mt: 2 }}>
                    {/* รหัส */}
                    <TextField
                        label="ຊື່"
                        variant="outlined"
                        fullWidth
                        value={recordName}
                        onChange={(e) => setRecordName(e.target.value)}
                        placeholder="A00001"
                        size="small"
                        InputLabelProps={{
                            sx: {
                                color: '#b0b3c7',
                                fontSize: '0.9rem',
                                '&.Mui-focused': {
                                    color: '#64b5f6',
                                }
                            }
                        }}
                        InputProps={{
                            sx: {
                                color: '#ffffff',
                                background: 'linear-gradient(135deg, rgba(26, 29, 58, 0.8) 0%, rgba(45, 27, 105, 0.8) 100%)',
                                borderRadius: '12px',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(100, 181, 246, 0.3)',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#64b5f6',
                                    boxShadow: '0 0 15px rgba(100, 181, 246, 0.2)',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#64b5f6',
                                    boxShadow: '0 0 20px rgba(100, 181, 246, 0.3)',
                                },
                            }
                        }}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleSubmit();
                            }
                        }}
                    />

                    {/* สถานะ */}
                    <FormControl fullWidth size="small">
                        <InputLabel
                            sx={{
                                color: '#b0b3c7',
                                fontSize: '0.9rem',
                                '&.Mui-focused': {
                                    color: '#64b5f6',
                                }
                            }}
                        >
                            ສະຖານະ
                        </InputLabel>
                        <Select
                            value={status}
                            label="ສະຖານະ"
                            onChange={(e) => setStatus(e.target.value)}
                            sx={{
                                color: '#ffffff',
                                background: 'linear-gradient(135deg, rgba(26, 29, 58, 0.8) 0%, rgba(45, 27, 105, 0.8) 100%)',
                                borderRadius: '12px',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(100, 181, 246, 0.3)',
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
                            <MenuItem value="">
                                <em>ເລືອກສະຖານະ</em>
                            </MenuItem>
                            <MenuItem value="ປະສົມ">
                                <Chip
                                    label="ປະສົມ"
                                    size="small"
                                    sx={{
                                        backgroundColor: '#ff9800',
                                        color: 'white',
                                        fontWeight: 'bold'
                                    }}
                                />
                            </MenuItem>
                            <MenuItem value="ຖືພາ">
                                <Chip
                                    label="ຖືພາ"
                                    size="small"
                                    sx={{
                                        backgroundColor: '#4caf50',
                                        color: 'white',
                                        fontWeight: 'bold'
                                    }}
                                />
                            </MenuItem>
                            <MenuItem value="ລ້ຽງລູກ">
                                <Chip
                                    label="ລ້ຽງລູກ"
                                    size="small"
                                    sx={{
                                        backgroundColor: '#2196f3',
                                        color: 'white',
                                        fontWeight: 'bold'
                                    }}
                                />
                            </MenuItem>
                            <MenuItem value="ພັກຟື້ນ">
                                <Chip
                                    label="ພັກຟື້ນ"
                                    size="small"
                                    sx={{
                                        backgroundColor: '#e91e63',
                                        color: 'white',
                                        fontWeight: 'bold'
                                    }}
                                />
                            </MenuItem>
                        </Select>
                    </FormControl>

                    {/* เจ้าของ */}
                    <FormControl fullWidth size="small">
                        <InputLabel
                            sx={{
                                color: '#b0b3c7',
                                fontSize: '0.9rem',
                                '&.Mui-focused': {
                                    color: '#64b5f6',
                                }
                            }}
                        >
                            ເຈົ້າຂອງ
                        </InputLabel>
                        <Select
                            value={owner}
                            label="ເຈົ້າຂອງ"
                            onChange={(e) => setOwner(e.target.value)}
                            sx={{
                                color: '#ffffff',
                                background: 'linear-gradient(135deg, rgba(26, 29, 58, 0.8) 0%, rgba(45, 27, 105, 0.8) 100%)',
                                borderRadius: '12px',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(100, 181, 246, 0.3)',
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
                            <MenuItem value="">
                                <em>ເລືອກເຈົ້າຂອງ</em>
                            </MenuItem>
                            <MenuItem value="Tay">
                                <Chip
                                    label="Tay"
                                    size="small"
                                    sx={{
                                        backgroundColor: '#3f51b5',
                                        color: 'white',
                                        fontWeight: 'bold'
                                    }}
                                />
                            </MenuItem>
                            <MenuItem value="Ter">
                                <Chip
                                    label="Ter"
                                    size="small"
                                    sx={{
                                        backgroundColor: '#9c27b0',
                                        color: 'white',
                                        fontWeight: 'bold'
                                    }}
                                />
                            </MenuItem>
                        </Select>
                    </FormControl>


                    {/* วันผสมพันธุ์ */}
                    <TextField
                        label="ວັນປະສົມພັນ"
                        variant="outlined"
                        fullWidth
                        size="small"
                        value={breedingDate}
                        onChange={(e) => handleDateChange(e.target.value, setBreedingDate)}
                        placeholder="DD/MM/YYYY"
                        InputLabelProps={{
                            sx: {
                                color: '#b0b3c7',
                                fontSize: '0.9rem',
                                '&.Mui-focused': {
                                    color: '#64b5f6',
                                }
                            }
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={(e) => openDatePicker(breedingDate, setBreedingDate, e)}
                                        sx={{
                                            color: '#64b5f6',
                                            p: 0.5,
                                            '&:hover': {
                                                backgroundColor: 'rgba(100, 181, 246, 0.1)',
                                            }
                                        }}
                                    >
                                        <CalendarTodayIcon sx={{ fontSize: '1.1rem' }} />
                                    </IconButton>
                                </InputAdornment>
                            ),
                            sx: {
                                color: '#ffffff',
                                background: 'linear-gradient(135deg, rgba(26, 29, 58, 0.8) 0%, rgba(45, 27, 105, 0.8) 100%)',
                                borderRadius: '12px',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: isValidDate(breedingDate) ? 'rgba(76, 175, 80, 0.5)' : 'rgba(100, 181, 246, 0.3)',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#64b5f6',
                                    boxShadow: '0 0 15px rgba(100, 181, 246, 0.2)',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#64b5f6',
                                    boxShadow: '0 0 20px rgba(100, 181, 246, 0.3)',
                                },
                            }
                        }}
                    />
                    {/* วันเกิด */}
                    <TextField
                        label="ວັນເກີດ"
                        variant="outlined"
                        fullWidth
                        size="small"
                        value={birthDate}
                        onChange={(e) => handleDateChange(e.target.value, setBirthDate)}
                        placeholder="DD/MM/YYYY"
                        InputLabelProps={{
                            sx: {
                                color: '#b0b3c7',
                                fontSize: '0.9rem',
                                '&.Mui-focused': {
                                    color: '#64b5f6',
                                }
                            }
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={(e) => openDatePicker(birthDate, setBirthDate, e)}
                                        sx={{
                                            color: '#64b5f6',
                                            p: 0.5,
                                            '&:hover': {
                                                backgroundColor: 'rgba(100, 181, 246, 0.1)',
                                            }
                                        }}
                                    >
                                        <CalendarTodayIcon sx={{ fontSize: '1.1rem' }} />
                                    </IconButton>
                                </InputAdornment>
                            ),
                            sx: {
                                color: '#ffffff',
                                background: 'linear-gradient(135deg, rgba(26, 29, 58, 0.8) 0%, rgba(45, 27, 105, 0.8) 100%)',
                                borderRadius: '12px',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: isValidDate(birthDate) ? 'rgba(76, 175, 80, 0.5)' : 'rgba(100, 181, 246, 0.3)',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#64b5f6',
                                    boxShadow: '0 0 15px rgba(100, 181, 246, 0.2)',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#64b5f6',
                                    boxShadow: '0 0 20px rgba(100, 181, 246, 0.3)',
                                },
                            }
                        }}
                    />

                    {/* วันที่แยกออกจากแม่ */}
                    <TextField
                        label="ວັນແຍກອອກຈາກແມ່"
                        variant="outlined"
                        fullWidth
                        size="small"
                        value={separationDate}
                        onChange={(e) => handleDateChange(e.target.value, setSeparationDate)}
                        placeholder="DD/MM/YYYY"
                        InputLabelProps={{
                            sx: {
                                color: '#b0b3c7',
                                fontSize: '0.9rem',
                                '&.Mui-focused': {
                                    color: '#64b5f6',
                                }
                            }
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={(e) => openDatePicker(separationDate, setSeparationDate, e)}
                                        sx={{
                                            color: '#64b5f6',
                                            p: 0.5,
                                            '&:hover': {
                                                backgroundColor: 'rgba(100, 181, 246, 0.1)',
                                            }
                                        }}
                                    >
                                        <CalendarTodayIcon sx={{ fontSize: '1.1rem' }} />
                                    </IconButton>
                                </InputAdornment>
                            ),
                            sx: {
                                color: '#ffffff',
                                background: 'linear-gradient(135deg, rgba(26, 29, 58, 0.8) 0%, rgba(45, 27, 105, 0.8) 100%)',
                                borderRadius: '12px',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: isValidDate(separationDate) ? 'rgba(76, 175, 80, 0.5)' : 'rgba(100, 181, 246, 0.3)',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#64b5f6',
                                    boxShadow: '0 0 15px rgba(100, 181, 246, 0.2)',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#64b5f6',
                                    boxShadow: '0 0 20px rgba(100, 181, 246, 0.3)',
                                },
                            }
                        }}
                    />

                    {/* วันดิ้นเอา (estrus) */}
                    <TextField
                        label="ວັນດິ້ນເອົາ"
                        variant="outlined"
                        fullWidth
                        size="small"
                        value={estrusDate}
                        onChange={(e) => handleDateChange(e.target.value, setEstrusDate)}
                        placeholder="DD/MM/YYYY"
                        InputLabelProps={{
                            sx: {
                                color: '#b0b3c7',
                                fontSize: '0.9rem',
                                '&.Mui-focused': {
                                    color: '#64b5f6',
                                }
                            }
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={(e) => openDatePicker(estrusDate, setEstrusDate, e)}
                                        sx={{
                                            color: '#64b5f6',
                                            p: 0.5,
                                            '&:hover': {
                                                backgroundColor: 'rgba(100, 181, 246, 0.1)',
                                            }
                                        }}
                                    >
                                        <CalendarTodayIcon sx={{ fontSize: '1.1rem' }} />
                                    </IconButton>
                                </InputAdornment>
                            ),
                            sx: {
                                color: '#ffffff',
                                background: 'linear-gradient(135deg, rgba(26, 29, 58, 0.8) 0%, rgba(45, 27, 105, 0.8) 100%)',
                                borderRadius: '12px',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: isValidDate(estrusDate) ? 'rgba(76, 175, 80, 0.5)' : 'rgba(100, 181, 246, 0.3)',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#64b5f6',
                                    boxShadow: '0 0 15px rgba(100, 181, 246, 0.2)',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#64b5f6',
                                    boxShadow: '0 0 20px rgba(100, 181, 246, 0.3)',
                                },
                            }
                        }}
                    />
                </Stack>
            </DialogContent>

            {/* Custom Calendar Popover */}
            <Popover
                open={calendarOpen}
                anchorEl={calendarAnchor}
                onClose={() => {
                    setCalendarOpen(false);
                    setCalendarAnchor(null);
                    setActiveDateSetter(null);
                }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                PaperProps={{
                    sx: {
                        background: 'linear-gradient(135deg, rgba(26, 29, 58, 0.98) 0%, rgba(45, 27, 105, 0.98) 100%)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(100, 181, 246, 0.3)',
                        borderRadius: '12px',
                        boxShadow: '0 15px 30px rgba(0, 0, 0, 0.4)',
                        color: '#ffffff',
                        p: 1.5,
                        minWidth: '260px',
                        maxWidth: '280px',
                    }
                }}
            >
                <Box>
                    {/* Calendar Header */}
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 1.5,
                        pb: 0.8,
                        borderBottom: '1px solid rgba(100, 181, 246, 0.2)'
                    }}>
                        <IconButton
                            onClick={() => navigateMonth(-1)}
                            size="small"
                            sx={{
                                color: '#64b5f6',
                                p: 0.5,
                                '&:hover': {
                                    backgroundColor: 'rgba(100, 181, 246, 0.1)',
                                }
                            }}
                        >
                            <ChevronLeftIcon fontSize="small" />
                        </IconButton>

                        <Typography sx={{
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            color: '#64b5f6',
                        }}>
                            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                        </Typography>

                        <IconButton
                            onClick={() => navigateMonth(1)}
                            size="small"
                            sx={{
                                color: '#64b5f6',
                                p: 0.5,
                                '&:hover': {
                                    backgroundColor: 'rgba(100, 181, 246, 0.1)',
                                }
                            }}
                        >
                            <ChevronRightIcon fontSize="small" />
                        </IconButton>
                    </Box>

                    {/* Day Headers */}
                    <Grid container spacing={0} sx={{ mb: 0.5 }}>
                        {dayNames.map((day) => (
                            <Grid item xs={12 / 7} key={day}>
                                <Box sx={{
                                    textAlign: 'center',
                                    py: 0.5,
                                    fontSize: '0.7rem',
                                    color: '#b0b3c7',
                                    fontWeight: 600,
                                }}>
                                    {day.slice(0, 2)}
                                </Box>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Calendar Days */}
                    <Grid container spacing={0}>
                        {generateCalendarDays().map((day, index) => (
                            <Grid item xs={12 / 7} key={index}>
                                <Button
                                    onClick={() => handleDateSelect(day.dateString)}
                                    sx={{
                                        minWidth: '30px',
                                        height: '30px',
                                        borderRadius: '6px',
                                        fontSize: '0.75rem',
                                        color: day.isCurrentMonth ? '#ffffff' : '#666',
                                        backgroundColor: day.isToday ? 'rgba(100, 181, 246, 0.3)' : 'transparent',
                                        border: day.isToday ? '1px solid #64b5f6' : '1px solid transparent',
                                        '&:hover': {
                                            backgroundColor: 'rgba(100, 181, 246, 0.2)',
                                            color: '#64b5f6',
                                        },
                                        width: '100%',
                                        margin: '1px',
                                        p: 0,
                                    }}
                                >
                                    {day.day}
                                </Button>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Today and Clear buttons */}
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mt: 1.5,
                        pt: 0.8,
                        borderTop: '1px solid rgba(100, 181, 246, 0.2)'
                    }}>
                        <Button
                            onClick={() => handleDateSelect(getTodayFormatted())}
                            size="small"
                            sx={{
                                color: '#64b5f6',
                                fontSize: '0.75rem',
                                py: 0.3,
                                px: 1,
                                '&:hover': {
                                    backgroundColor: 'rgba(100, 181, 246, 0.1)',
                                }
                            }}
                        >
                            วันนี้
                        </Button>
                        <Button
                            onClick={() => {
                                setCalendarOpen(false);
                                setCalendarAnchor(null);
                                setActiveDateSetter(null);
                            }}
                            size="small"
                            sx={{
                                color: '#b0b3c7',
                                fontSize: '0.75rem',
                                py: 0.3,
                                px: 1,
                                '&:hover': {
                                    backgroundColor: 'rgba(176, 179, 199, 0.1)',
                                }
                            }}
                        >
                            ปิด
                        </Button>
                    </Box>
                </Box>
            </Popover>

            <DialogActions sx={{
                borderTop: '1px solid rgba(100, 181, 246, 0.2)',
                p: 3,
                gap: 2,
                background: 'linear-gradient(135deg, rgba(100, 181, 246, 0.05) 0%, rgba(255, 112, 67, 0.05) 100%)',
                justifyContent: 'space-between',
            }}>
                {/* Delete Button */}
                {onDelete && recordData?.id && (
                    <Button
                        onClick={handleDeleteClick}
                        variant="outlined"
                        startIcon={<DeleteIcon />}
                        sx={{
                            color: '#f44336',
                            borderColor: 'rgba(244, 67, 54, 0.3)',
                            borderRadius: '12px',
                            px: 3,
                            '&:hover': {
                                borderColor: '#f44336',
                                backgroundColor: 'rgba(244, 67, 54, 0.1)',
                                color: '#f44336',
                                boxShadow: '0 0 15px rgba(244, 67, 54, 0.2)',
                            },
                            fontSize: '0.9rem',
                            fontWeight: 600,
                        }}
                    >
                        ລົບ
                    </Button>
                )}

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        onClick={handleClose}
                        variant="outlined"
                        sx={{
                            color: '#b0b3c7',
                            borderColor: 'rgba(100, 181, 246, 0.3)',
                            borderRadius: '12px',
                            px: 3,
                            '&:hover': {
                                borderColor: '#64b5f6',
                                backgroundColor: 'rgba(100, 181, 246, 0.1)',
                                color: '#64b5f6',
                                boxShadow: '0 0 15px rgba(100, 181, 246, 0.2)',
                            },
                            fontSize: '0.9rem',
                            fontWeight: 600,
                        }}
                    >
                        ຍົກເລີກ
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={!recordName.trim()}
                        sx={{
                            background: 'linear-gradient(45deg, #64b5f6 30%, #ff7043 90%)',
                            borderRadius: '12px',
                            px: 3,
                            boxShadow: '0 8px 25px rgba(100, 181, 246, 0.3)',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #42a5f5 30%, #ff5722 90%)',
                                boxShadow: '0 12px 35px rgba(100, 181, 246, 0.4)',
                            },
                            '&:disabled': {
                                background: 'rgba(176, 179, 199, 0.2)',
                                color: 'rgba(176, 179, 199, 0.5)',
                            },
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            color: '#ffffff',
                        }}
                    >
                        ບັນທຶກ
                    </Button>
                </Box>
            </DialogActions>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteConfirmOpen}
                onClose={() => setDeleteConfirmOpen(false)}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    sx: {
                        background: 'linear-gradient(135deg, rgba(26, 29, 58, 0.95) 0%, rgba(45, 27, 105, 0.95) 100%)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(244, 67, 54, 0.3)',
                        borderRadius: '20px',
                        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
                        color: '#ffffff',
                    },
                }}
            >
                <DialogTitle sx={{
                    background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(244, 67, 54, 0.05) 100%)',
                    borderBottom: '1px solid rgba(244, 67, 54, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pb: 2,
                    pt: 3,
                }}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            color: '#f44336',
                            textAlign: 'center',
                        }}
                    >
                        ຢືນຢັນການລົບ
                    </Typography>
                </DialogTitle>

                <DialogContent sx={{ py: 3, textAlign: 'center' }}>
                    <Typography
                        variant="body1"
                        sx={{
                            color: '#ffffff',
                            fontSize: '0.95rem',
                            mb: 1,
                        }}
                    >
                        ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລົບຂໍ້ມູນນີ້?
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            color: '#b0b3c7',
                            fontSize: '0.85rem',
                            fontStyle: 'italic',
                        }}
                    >
                        ການດຳເນີນງານນີ້ບໍ່ສາມາດຍົກເລີກໄດ້
                    </Typography>
                </DialogContent>

                <DialogActions sx={{
                    borderTop: '1px solid rgba(244, 67, 54, 0.2)',
                    p: 3,
                    gap: 2,
                    justifyContent: 'center',
                }}>
                    <Button
                        onClick={() => setDeleteConfirmOpen(false)}
                        variant="outlined"
                        sx={{
                            color: '#b0b3c7',
                            borderColor: 'rgba(100, 181, 246, 0.3)',
                            borderRadius: '12px',
                            px: 3,
                            '&:hover': {
                                borderColor: '#64b5f6',
                                backgroundColor: 'rgba(100, 181, 246, 0.1)',
                                color: '#64b5f6',
                            },
                            fontSize: '0.9rem',
                            fontWeight: 600,
                        }}
                    >
                        ຍົກເລີກ
                    </Button>
                    <Button
                        onClick={handleDelete}
                        variant="contained"
                        sx={{
                            background: 'linear-gradient(45deg, #f44336 30%, #d32f2f 90%)',
                            borderRadius: '12px',
                            px: 3,
                            boxShadow: '0 8px 25px rgba(244, 67, 54, 0.3)',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #d32f2f 30%, #c62828 90%)',
                                boxShadow: '0 12px 35px rgba(244, 67, 54, 0.4)',
                            },
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            color: '#ffffff',
                        }}
                    >
                        ລົບ
                    </Button>
                </DialogActions>
            </Dialog>
        </Dialog>
    );
};

export default EditRecordModal;
