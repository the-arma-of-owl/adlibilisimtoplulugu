require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'users.json');

// Ensure data directory exists
const dataDir = path.dirname(DATA_FILE);
fs.mkdir(dataDir, { recursive: true }).catch(() => {});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Helper function to read users
async function readUsers() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { users: [] };
  }
}

// Helper function to write users
async function writeUsers(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/codesparknight', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'codesparknight.html'));
});

app.get('/adminpanel', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'adminpanel.html'));
});

app.get('/codefest', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'codefest.html'));
});

// API: Submit test
app.post('/api/submit-test', async (req, res) => {
  try {
    const { name, answers } = req.body;
    
    if (!name || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'Eksik bilgi' });
    }

    // Questions mapping - same as frontend
    const questions = [
      { options: [{field: 'OS'}, {field: 'SE'}, {field: 'DF'}, {field: 'DS'}] },
      { options: [{field: 'DF'}, {field: 'SE'}, {field: 'CTI'}, {field: 'DS'}] },
      { options: [{field: 'CTI'}, {field: 'OS'}, {field: 'DS'}, {field: 'NS'}] },
      { options: [{field: 'OS'}, {field: 'DF'}, {field: 'SE'}, {field: 'DS'}] },
      { options: [{field: 'SE'}, {field: 'DS'}, {field: 'DF'}, {field: 'OS'}] },
      { options: [{field: 'NS'}, {field: 'DS'}, {field: 'OS'}, {field: 'CTI'}] },
      { options: [{field: 'OS'}, {field: 'DS'}, {field: 'CTI'}, {field: 'SE'}] },
      { options: [{field: 'CTI'}, {field: 'SE'}, {field: 'DS'}, {field: 'OS'}] },
      { options: [{field: 'DF'}, {field: 'SE'}, {field: 'NS'}, {field: 'DS'}] },
      { options: [{field: 'DF'}, {field: 'NS'}, {field: 'DS'}, {field: 'OS'}] },
      { options: [{field: 'NS'}, {field: 'DS'}, {field: 'DF'}, {field: 'CTI'}] },
      { options: [{field: 'CTI'}, {field: 'DF'}, {field: 'DS'}, {field: 'SE'}] },
      { options: [{field: 'CTI'}, {field: 'OS'}, {field: 'SE'}, {field: 'NS'}] },
      { options: [{field: 'NS'}, {field: 'SE'}, {field: 'CTI'}, {field: 'DS'}] },
      { options: [{field: 'CTI'}, {field: 'NS'}, {field: 'SE'}, {field: 'OS'}] },
      { options: [{field: 'DF'}, {field: 'NS'}, {field: 'OS'}, {field: 'DS'}] },
      { options: [{field: 'NS'}, {field: 'CTI'}, {field: 'OS'}, {field: 'SE'}] },
      { options: [{field: 'CTI'}, {field: 'NS'}, {field: 'OS'}, {field: 'DS'}] },
      { options: [{field: 'CTI'}, {field: 'SE'}, {field: 'OS'}, {field: 'DF'}] },
      { options: [{field: 'NS'}, {field: 'SE'}, {field: 'CTI'}, {field: 'OS'}] },
      { options: [{field: 'DF'}, {field: 'OS'}, {field: 'SE'}, {field: 'DS'}] },
      { options: [{field: 'CTI'}, {field: 'DF'}, {field: 'NS'}, {field: 'DS'}] },
      { options: [{field: 'SE'}, {field: 'DF'}, {field: 'DS'}, {field: 'OS'}] },
      { options: [{field: 'CTI'}, {field: 'SE'}, {field: 'NS'}, {field: 'DF'}] },
      { options: [{field: 'NS'}, {field: 'SE'}, {field: 'CTI'}, {field: 'DF'}] }
    ];

    // Field mapping
    const fieldMap = {
      'DF': 0, // Digital Forensics
      'OS': 1, // Offensive Security
      'DS': 2, // Defensive Security
      'NS': 3, // Network Security
      'SE': 4, // Sosyal Mühendislik
      'CTI': 5 // Cyber Threat Intelligence
    };

    const fields = [
      'Digital Forensics',
      'Offensive Security',
      'Defensive Security',
      'Network Security',
      'Sosyal Mühendislik',
      'Cyber Threat Intelligence'
    ];
    
    // Calculate scores based on actual question mappings
    const scores = [0, 0, 0, 0, 0, 0];
    answers.forEach((answerIndex, questionIndex) => {
      if (answerIndex !== undefined && questions[questionIndex]) {
        const selectedOption = questions[questionIndex].options[answerIndex];
        if (selectedOption && selectedOption.field) {
          const fieldIndex = fieldMap[selectedOption.field];
          if (fieldIndex !== undefined) {
            scores[fieldIndex]++;
          }
        }
      }
    });
    
    const maxScore = Math.max(...scores);
    const fieldIndex = scores.indexOf(maxScore);
    const field = fields[fieldIndex];

    // Save user
    const data = await readUsers();
    const newUser = {
      id: uuidv4(),
      name: name,
      field: field,
      answers: answers,
      approved: false,
      timestamp: new Date().toISOString()
    };
    
    data.users.push(newUser);
    await writeUsers(data);

    res.json({ success: true, field: field, id: newUser.id });
  } catch (error) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// API: Admin login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;
  
  if (username === adminUsername && password === adminPassword) {
    res.json({ success: true });
  } else {
    res.status(401).json({ error: 'Hatalı kullanıcı adı veya şifre' });
  }
});

// API: Get all users (admin)
app.get('/api/admin/users', async (req, res) => {
  try {
    const data = await readUsers();
    res.json({ users: data.users });
  } catch (error) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// API: Approve user
app.post('/api/admin/approve/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await readUsers();
    
    const user = data.users.find(u => u.id === id);
    if (!user) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }
    
    user.approved = true;
    await writeUsers(data);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// API: Delete user
app.post('/api/admin/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await readUsers();
    
    data.users = data.users.filter(u => u.id !== id);
    await writeUsers(data);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// API: Get approved users for codefest
app.get('/api/codefest/users', async (req, res) => {
  try {
    const data = await readUsers();
    const approvedUsers = data.users.filter(u => u.approved === true);
    res.json({ users: approvedUsers });
  } catch (error) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// API: Add test user (admin)
app.post('/api/admin/add-test-user', async (req, res) => {
  try {
    const { name, field } = req.body;
    
    if (!name || !field) {
      return res.status(400).json({ error: 'İsim ve alan gereklidir' });
    }

    const validFields = [
      'Digital Forensics',
      'Offensive Security',
      'Defensive Security',
      'Network Security',
      'Sosyal Mühendislik',
      'Cyber Threat Intelligence'
    ];

    if (!validFields.includes(field)) {
      return res.status(400).json({ error: 'Geçersiz alan' });
    }

    const data = await readUsers();
    const newUser = {
      id: uuidv4(),
      name: name,
      field: field,
      answers: [],
      approved: false,
      timestamp: new Date().toISOString(),
      isTestUser: true
    };
    
    data.users.push(newUser);
    await writeUsers(data);

    res.json({ success: true, id: newUser.id });
  } catch (error) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

app.listen(PORT, () => {
  // Server started
});

