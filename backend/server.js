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

// Crear orden de pago única
app.post('/paypal/create-order', async (req, res) => {
  const { accessToken } = req.body;
  try {
    const response = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders`,
      {
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: '15.00',
            },
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error creating PayPal order:', error.message);
    res.status(500).send('Error creating order');
  }
});

// Capturar pago después de aprobación
app.post('/paypal/capture-payment', async (req, res) => {
  const { accessToken, orderId } = req.body;
  try {
    const response = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error capturing payment:', error.message);
    res.status(500).send('Error capturing payment');
  }
});




const multer = require('multer');
const path = require('path');
const fs = require('fs');


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

// Endpoint para subir la imagen de perfil
app.post('/api/upload-profile-image/:userId', upload.single('file'), (req, res) => {
  if (!req.file) {
    console.log('No file uploaded.');
    return res.status(400).send('No file uploaded.');
  }

  const userId = req.params.userId;
  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

  const dbPath = path.join(__dirname, '../db.json');
  console.log('Reading database:', dbPath);

  try {
    const rawData = fs.readFileSync(dbPath, 'utf-8');
    const db = JSON.parse(rawData);

    const userIndex = db.users.findIndex(user => user.id === userId);

    if (userIndex === -1) {
      console.log('User not found:', userId);
      return res.status(404).send('User not found.');
    }

    console.log('Updating user:', db.users[userIndex]);
    db.users[userIndex].profileImage = imageUrl;

    // Guardar los cambios en la base de datos
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
    console.log('Database updated successfully');

    res.json({ imageUrl });
  } catch (error) {
    console.error('Error updating profile image:', error);
    res.status(500).send('Internal server error.');
  }
});


// Endpoint para subir la imagen de la receta
app.post('/api/upload-recipe-image/:idMeal', upload.single('file'), (req, res) => {
  console.log("📥 Recibiendo imagen para ID:", req.params.idMeal);

  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const recipeId = req.params.idMeal;
  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

  const dbPath = path.join(__dirname, '../db2.json');
  const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

  // Buscar la receta en el archivo JSON
  const recipeIndex = dbData.meals.findIndex(recipe => recipe.idMeal === recipeId);

  if (recipeIndex === -1) {
    return res.status(404).send('Recipe not found.');
  }

  dbData.meals[recipeIndex].imageUrl = imageUrl;

  fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));

  res.json({ imageUrl });
});

// Servir la carpeta de uploads como estatica
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Iniciar el servidor en el puerto 3001
const port = 3001;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
