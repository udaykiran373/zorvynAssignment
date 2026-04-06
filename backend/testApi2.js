const axios = require('axios');
async function test() {
    try {
        await axios.post('http://localhost:5000/api/auth/register', {
            name: "Demo",
            email: "notanemail",
            password: "123",
            role: "Viewer"
        });
    } catch(err) {
        console.log("Reg Error:", err.response?.data);
    }
}
test();
