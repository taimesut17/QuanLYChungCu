import axios from "axios";

export const handleGenerateQRCode = async () => {
    try {

        const url = 'https://api.vietqr.io/v2/generate';

        const headers = {
            'x-client-id': 'cb6a064b-485a-4e31-9f72-53d476f456b2',
            'x-api-key': 'e1f848b6-4c06-4ec2-9de7-fff2fc0e0701',
            'Content-Type': 'application/json',
        };

        const requestBody = {
            "accountNo": 6015665679999,
            "accountName": "NGUYEN THANH TAI",
            "acqId": 970415,
            "amount": 79000,
            "addInfo": "Ung Ho Quy Vac Xin",
            "format": "text",
            "template": "compact"
        }

        const response = await axios.post(url, requestBody, { headers });

        console.log('QR Code Data:', response.data);

        // Handle the response data accordingly
        if (response.data.code === '00') {
            // Process the successful response
        } else {
            console.error('Failed to generate QR code:', response.data.desc);
            // showErrorAlert(`Đã có lỗi xảy ra khi tạo mã QR: ${response.data.desc}`);
        }
    } catch (error) {
        console.error('Error:', error);
        // showErrorAlert();
    }
};