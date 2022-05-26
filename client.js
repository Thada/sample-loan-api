const axios = require('axios');

const hostname = process.env.HOST || 'http://127.0.0.1';
const port = process.env.PORT || 3000;

// Some sample data to POST
const postData = {
    "amount": 100000,
    "interest_rate": 5.0,
    "months": 20,
    "payment": 1000
};

// Some sample data to PUT
const putData = {
    "amount": 250000,
    "interest_rate": 4.3,
    "months": 30,
    "payment": 2100
};


axios.post(`${hostname}:${port}/v1/loan`, postData)
    .then((res) => {
        console.log(`POSTING data...`);
        console.log(res.data);
        // store the generated loan_id in a variable
        const loan_id = res.data.loan_id;

        axios.get(`${hostname}:${port}/v1/loan/${loan_id}`)
            .then((res) => {
                console.log(`GETTING data, loan_id: ${loan_id}...`);
                console.log(res.data);
                axios.put(`${hostname}:${port}/v1/loan/${loan_id}`, putData)
                    .then((res) => {
                        console.log(`PUTTING data, loan_id: ${loan_id}...`);
                        console.log(res.data);
                    });
            });
    })
    .catch((err) => {
        console.log(err);
    });

