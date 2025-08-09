import React, { useState, useEffect } from 'react';
import { getAllRecords, RecordData } from './firebaseService';
import { ensureAuthenticated } from './auth';

interface FirebaseTestProps {
    onBack?: () => void;
}

const FirebaseTest: React.FC<FirebaseTestProps> = ({ onBack }) => {
    const [records, setRecords] = useState<RecordData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [authStatus, setAuthStatus] = useState<string>('กำลังตรวจสอบ...');

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('🔥 กำลังเชื่อมต่อ Firebase...');

                // ตรวจสอบและล็อกอินก่อน
                setAuthStatus('กำลังล็อกอิน...');
                const user = await ensureAuthenticated();
                if (user) {
                    setAuthStatus(`ล็อกอินสำเร็จ: ${user.uid}`);
                } else {
                    setAuthStatus('ล็อกอินล้มเหลว');
                }

                // ดึงข้อมูล
                const data = await getAllRecords();
                console.log('✅ ดึงข้อมูลสำเร็จ:', data);
                setRecords(data);
                setError('');
            } catch (err: any) {
                console.error('❌ เกิดข้อผิดพลาด:', err);

                // แสดงข้อความข้อผิดพลาดที่เข้าใจง่าย
                if (err.code === 'permission-denied') {
                    setError('❌ ไม่มีสิทธิ์เข้าถึงข้อมูล กรุณาตรวจสอบ Firebase Security Rules');
                } else if (err.code === 'unavailable') {
                    setError('❌ ไม่สามารถเชื่อมต่อ Firebase ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต');
                } else {
                    setError(`❌ เกิดข้อผิดพลาด: ${err.message || err}`);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div style={{ padding: '20px' }}>🔄 กำลังโหลดข้อมูล...</div>;
    }

    if (error) {
        return <div style={{ padding: '20px', color: 'red' }}>❌ {error}</div>;
    }

    return (
        <div style={{ padding: '20px' }}>
            {onBack && (
                <button
                    onClick={onBack}
                    style={{
                        background: '#2196f3',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        marginBottom: '20px',
                        fontSize: '0.9rem',
                    }}
                >
                    ← ย้อนกลับ
                </button>
            )}

            <h1>🔥 Firebase Connection Test</h1>
            <p><strong>🔐 สถานะการล็อกอิน:</strong> {authStatus}</p>

            {!error && !loading && (
                <>
                    <h2>✅ เชื่อมต่อสำเร็จ!</h2>
                    <p><strong>จำนวนข้อมูล:</strong> {records.length} รายการ</p>
                </>
            )}

            {records.length > 0 && (
                <div>
                    <h3>📋 ข้อมูลทั้งหมด:</h3>
                    {records.map((record, index) => (
                        <div key={record.id || index} style={{
                            border: '1px solid #ccc',
                            margin: '10px 0',
                            padding: '15px',
                            borderRadius: '8px',
                            backgroundColor: '#f9f9f9'
                        }}>
                            <p><strong>ID:</strong> {record.id}</p>
                            <p><strong>ชื่อ:</strong> {record.name}</p>
                            <p><strong>สถานะ:</strong> {record.status}</p>
                            <p><strong>เจ้าของ:</strong> {record.owner}</p>
                            <p><strong>วันผสมพันธุ์:</strong> {record.breedingDate}</p>
                            <p><strong>วันเกิด:</strong> {record.birthDate}</p>
                            <p><strong>วันแยกออกจากแม่:</strong> {record.separation_date}</p>
                            <p><strong>วันดิ้นเอา:</strong> {record.estrus_date}</p>
                        </div>
                    ))}
                </div>
            )}

            {records.length === 0 && (
                <div>
                    <h3>📭 ไม่มีข้อมูลในฐานข้อมูล</h3>
                    <p>กรุณาเพิ่มข้อมูลใหม่ในแอปพลิเคชัน</p>
                </div>
            )}
        </div>
    );
};

export default FirebaseTest;
