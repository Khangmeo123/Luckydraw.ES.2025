const express = require('express');
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');
var cors = require('cors')
var bodyParser = require('body-parser')


const app = express();
app.use(cors())
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
const PORT = 5000;

// Function to read data from Excel file
const readExcelData = (filePath) => {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    return xlsx.utils.sheet_to_json(worksheet);
};

function getRandomLuckyUser(allData,selectedData) {
    min = Math.ceil(0);
    max = Math.floor(allData?.length - 1);
    const nums = [];
    const listSelectedId = selectedData?.map(p => Number(p?.Id));
    for (let i = min; i <= max; i++) {
        if (!listSelectedId.includes(allData[i].Id)) nums.push(i);
    }
     if (nums.length === 0) return false;
     const randomIndex = Math.floor(Math.random() * nums.length);
     const numberIndex = nums[randomIndex];
    const luckyUser = allData[numberIndex];
    return luckyUser
  }

// // API endpoint to get data from Excel file
app.get('/list-user', (req, res) => {
    const filePath = path.join(__dirname, 'Data2025.xlsx');
    try {
        const data = readExcelData(filePath);
        res.json(data);
    } catch (error) {
        res.status(500).send('Error reading Excel file');
    }
});


app.post('/update-lucky-user', (req, res) => {
    try {
        fs.readFile('./LuckyUser.json', function(err, data) { 
            const listLuckyUser  = JSON.parse(data);
            listLuckyUser.push(req.body);
            dataJson = JSON.stringify(listLuckyUser);
            if (err) throw err;
            else {
                fs.writeFile('./LuckyUser.json',dataJson, 'utf-8',
                    (err) => {
                        if (err) {
                            res.send(false);
                        } else {
                            res.send(true);
                        }
                        }
                    )
            }
            
        }); 
        
    } catch (error) {
        res.status(500).send('Error updating');
    }
});

app.get('/get-lucky-user', (req, res) => {
    const filePath = path.join(__dirname, 'Data2025.xlsx');
    try {
        const dataAll = readExcelData(filePath);
        fs.readFile('./SelectedUser.json', function(err, data) { 
            const listSelectedUser  = JSON.parse(data);
            if (err) throw err;
            if(dataAll.length <= listSelectedUser.length) res.send("Tất cả đều đã được chọn!");
            else {
                const luckyUser = getRandomLuckyUser(dataAll,listSelectedUser);
                res.json(luckyUser);
                listSelectedUser.push(luckyUser);
                dataJson = JSON.stringify(listSelectedUser);
                fs.writeFile('./SelectedUser.json',dataJson, 'utf-8',
                    (err) => {
                        if (err) {
                            console.log('Error writing file:', err);
                        } else {
                            console.log('Successfully wrote file');
                    }
                }
            )}  
        }); 
    } catch (error) {
        res.status(500).send('Error reading Excel file');
    }
});

// // API endpoint to get data from Excel file
app.get('/list-lucky-user', (req, res) => {
    try {
        fs.readFile('./LuckyUser.json', function(err, data) { 
            const listLuckyUser  = JSON.parse(data);
            if (err) throw err;
            else {
                res.json(listLuckyUser);
            }  
        }); 
    } catch (error) {
        res.status(500).send('Error reading data');
    }
});

app.get('/reset', (req, res) => {
    const data = [];
    dataJson = JSON.stringify(data);
    try {
        fs.writeFile('./SelectedUser.json',dataJson, 'utf-8',
            (err) => {
                if (err) {
                    console.log('Error writing file:', err);
                } else {
                    console.log('Successfully wrote file');
            }
        });
        fs.writeFile('./LuckyUser.json',dataJson, 'utf-8',
            (err) => {
                if (err) {
                    console.log('Error writing file:', err);
                } else {
                    console.log('Successfully wrote file');
            }
        });
        res.json(true);
    } catch (error) {
        res.status(500).send('Error when reset data');
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});