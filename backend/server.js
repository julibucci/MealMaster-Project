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

// Crear plan de suscripcion
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




const multer = require('multer');
const path = require('path');
const fs = require('fs');


// Configuracion de Multer para guardar imagenes
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
    return res.status(400).send('No file uploaded.');
  }

  const userId = req.params.userId;
  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;


  const users = require('./db.json').users;
  const userIndex = users.findIndex(user => user.id === userId);

  if (userIndex === -1) {
    return res.status(404).send('User not found.');
  }

  users[userIndex].profileImage = imageUrl;

  // Guardar los cambios en la base de datos
  fs.writeFileSync('./db.json', JSON.stringify({ users }, null, 2));

  res.json({ imageUrl });
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
