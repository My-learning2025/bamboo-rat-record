import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Typography,
    IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface AddRecordModalProps {
    open: boolean;
    onClose: () => void;
    onAdd: (recordId: string) => void;
}

const AddRecordModal: React.FC<AddRecordModalProps> = ({ open, onClose, onAdd }) => {
    const [recordId, setRecordId] = useState<string>('');

    const handleSubmit = () => {
        if (recordId.trim()) {
            onAdd(recordId.trim());
            setRecordId('');
            onClose();
        }
    };

    const handleClose = () => {
        setRecordId('');
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    backgroundColor: '#2c2c2c',
                    color: '#ffffff',
                    margin: 2,
                    maxHeight: 'calc(100vh - 64px)',
                },
            }}
        >
            <DialogTitle sx={{
                backgroundColor: '#1e1e1e',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                pb: 1,
            }}>
                <Typography variant="h6" sx={{ fontSize: '1.1rem' }}>
                    เพิ่มข้อมูลใหม่
                </Typography>
                <IconButton onClick={handleClose} sx={{ color: '#b0b0b0' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ backgroundColor: '#2c2c2c', py: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="body1" sx={{ color: '#b0b0b0', fontSize: '0.9rem' }}>
                        กรุณาใส่รหัสข้อมูลที่ต้องการเพิ่ม
                    </Typography>

                    <TextField
                        label="รหัสข้อมูล"
                        variant="outlined"
                        fullWidth
                        value={recordId}
                        onChange={(e) => setRecordId(e.target.value)}
                        placeholder="เช่น A00001"
                        size="small"
                        InputLabelProps={{
                            sx: { color: '#b0b0b0', fontSize: '0.9rem' }
                        }}
                        InputProps={{
                            sx: {
                                color: '#ffffff',
                                backgroundColor: '#1e1e1e',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#404040',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#90caf9',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#90caf9',
                                },
                            }
                        }}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleSubmit();
                            }
                        }}
                    />
                </Box>
            </DialogContent>

            <DialogActions sx={{ backgroundColor: '#2c2c2c', p: 2, gap: 1 }}>
                <Button
                    onClick={handleClose}
                    variant="outlined"
                    sx={{
                        color: '#b0b0b0',
                        borderColor: '#404040',
                        '&:hover': {
                            borderColor: '#90caf9',
                            backgroundColor: 'rgba(144, 202, 249, 0.1)',
                        },
                        fontSize: '0.85rem',
                    }}
                >
                    ยกเลิก
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={!recordId.trim()}
                    sx={{
                        backgroundColor: '#90caf9',
                        color: '#000000',
                        '&:hover': {
                            backgroundColor: '#64b5f6',
                        },
                        '&:disabled': {
                            backgroundColor: '#404040',
                            color: '#666666',
                        },
                        fontSize: '0.85rem',
                    }}
                >
                    เพิ่มข้อมูล
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddRecordModal;
