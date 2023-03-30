const express = require('express');
const bodyParser = require('body-parser');
const clobby = require('./routes/clobby');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/operation', clobby);

app.use('/', (req, res) => {
  res.status(200).send({ message: '01-INVALID' });
});

app.listen(PORT, () => {
  console.log(`[*] Server running on port ${PORT}`);
});
