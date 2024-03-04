const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./util/db');
const productRoutes = require('./routes/productRoutes'); 

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use('/', express.static('views'));
app.use('/products', productRoutes); // Use the productRoutes for /products route

sequelize
  .sync()
  .then(() => {
    console.log('Database synchronized');
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  });

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
