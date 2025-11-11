import express from 'express';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = 8000;

app.use(bodyParser.json());

const router = express.Router();

// 📨 Gửi email (mock)
router.post('/email', (req, res) => {
  const email = req.body;
  console.log('📧 Received email:', email);
  res.status(200).json({ success: true });
});

// 📥 Lấy trạng thái email từ danh sách IdentifierCode
router.post('/get-by-identifiers', (req, res) => {
  // log the header to console
  const content = req.body;
  console.log('📥 Received request with headers:', req.content);
  const { identifierCodes, project, keys, campusCode } = content;
  console.log('📥 Processing request with:', { 
    identifierCodes, 
    project,
    keys,
    campusCode 
  });
  // Log identifier codes to console
  console.log('📥 Received identifier codes:', identifierCodes);
  const emailProxyLogs = identifierCodes.map(identifierCode => ({
    Id: uuidv4(),
    Bcc: [],
    IdentifierCode: identifierCode,
    Subject: "Test Subject",
    Project: "StudentCareSystem",
    Status: true,
    CampusCode: "Campus001",
    Created: new Date(),
    Updated: new Date(),
    Recipient: ["example@example.com"]
  }));
  // Log email proxy logs to console
  console.log('📥 Email proxy logs:', emailProxyLogs);

  res.json(emailProxyLogs);
});

// 🔁 Gửi lại email theo ID
router.get('/sent-again', (req, res) => {
  const { id } = req.query;
  //console.log(`🔁 Resending email with ID: ${id}`);
  res.status(200).json({ success: true });
});

// Áp dụng prefix /api cho tất cả các route
app.use('/api', router);

// Khởi động server
app.listen(PORT, () => {
  console.log(`🚀 Mock Email Service running at http://localhost:${PORT}/api`);
});
