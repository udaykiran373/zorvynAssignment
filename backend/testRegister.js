const axios = require('axios');
async function test() {
    try {
        const res = await axios.post('http://localhost:5000/api/auth/register', {
            name: "Test Name",
            email: "testemail" + Math.random(),
            password: "password123",
            role: "Admin"
        });
        console.log("Success:", res.data);
    } catch(err) {
        console.log("Error response code:", err.response?.status);
        console.log("Error response data:", err.response?.data);
        console.log("Error message:", err.message);
    }
}
test();
