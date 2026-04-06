const axios = require('axios');
async function test() {
    try {
        await axios.post('http://localhost:5000/api/auth/register', {
            name: "Demo Admin",
            email: "test@test.com",
            password: "password123",
            role: "Admin"
        });
        console.log("Registered successfully");
    } catch(err) {
        console.log("Reg Error:", err.response?.data);
        if (err.response?.data?.message?.includes('Duplicate field')) {
            try {
                const res = await axios.post('http://localhost:5000/api/auth/login', {
                    email: "test@test.com",
                    password: "password123"
                });
                console.log("Login success");
            } catch(e) {
                console.log("Login Error:", e.response?.data);
            }
        }
    }
}
test();
