const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Credenciales de PayPal
const CLIENT_ID = 'AUQ44EkN4LVVZAFZNs4dJTW4yqE2-1cjZlM0vxakPTMKIVWIKum1R34-jx8auU5wW1rtrtUIm4AeAdtj';
const SECRET = 'ED-KGbADzj3if9md-0-0dbXAVa3PnvA5ZRoUEqVDIglro6DPG8tsyW4B9_bo5QR2JesegbQuBtIv-wUi';
const PAYPAL_API = 'https://api-m.sandbox.paypal.com';

// Obtener access token
app.get('/paypal/access-token', async (req, res) => {
  try {
    const auth = `${CLIENT_ID}:${SECRET}`;
    const response = await axios.post(
      `${PAYPAL_API}/v1/oauth2/token`,
      'grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${Buffer.from(auth).toString('base64')}`,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error getting access token:', error.message);
    res.status(500).send('Error getting access token');
  }
});

// Crear producto
app.post('/paypal/product', async (req, res) => {
  const { name, description, accessToken } = req.body;
  try {
    const response = await axios.post(
      `${PAYPAL_API}/v1/catalogs/products`,
      {
        name,
        description,
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error creating product:', error.message);
    res.status(500).send('Error creating product');
  }
});

// Crear plan de suscripción
app.post('/paypal/plan', async (req, res) => {
  const { productId, planName, price, accessToken } = req.body;
  try {
    const response = await axios.post(
      `${PAYPAL_API}/v1/billing/plans`,
      {
        product_id: productId,
        name: planName,
        billing_cycles: [
          {
            frequency: { interval_unit: 'MONTH', interval_count: 1 },
            tenure_type: 'REGULAR',
            sequence: 1,
            pricing_scheme: { fixed_price: { value: price, currency_code: 'USD' } },
          },
        ],
        payment_preferences: { auto_bill_outstanding: true },
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error creating plan:', error.message);
    res.status(500).send('Error creating plan');
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});




const multer = require('multer');
const path = require('path');


// Configuración de Multer para guardar imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Endpoint para subir la imagen
app.post('/api/upload-profile-image/:userId', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const userId = req.params.userId;
  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

  // Simula la actualización del usuario en la base de datos
  const users = require('./db.json').users;
  const userIndex = users.findIndex(user => user.id === userId);

  if (userIndex === -1) {
    return res.status(404).send('User not found.');
  }

  users[userIndex].profileImage = imageUrl;

  // Guardar los cambios en la base de datos
  const fs = require('fs');
  fs.writeFileSync('./db.json', JSON.stringify({ users }, null, 2));

  res.json({ imageUrl });  // Responder con la URL de la imagen
});
app.post('/api/upload-profile-image/:userId', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const userId = req.params.userId;
  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

  // Simula la actualización del usuario en la base de datos
  const users = require('./db.json').users;
  const userIndex = users.findIndex(user => user.id === userId);

  if (userIndex === -1) {
    return res.status(404).send('User not found.');
  }

  users[userIndex].profileImage = imageUrl;

  // Guardar los cambios en la base de datos
  const fs = require('fs');
  fs.writeFileSync('./db.json', JSON.stringify({ users }, null, 2));

  res.json({ imageUrl });  // Responder con la URL de la imagen
});

// Servir la carpeta de uploads como estática
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

