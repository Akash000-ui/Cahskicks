const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const bodyParser = require('body-parser');
const { add, format } = require('date-fns');

server.use(middlewares);
server.use(bodyParser.json());

// Custom route for creating a new cashkick and updating contracts

server.get('/contracts-list', (req, res) => {
  const db = router.db
  const contracts = db.get('contracts').filter({ status: 'AVAILABLE' }).value();
  res.status(200).send(contracts)
})
server.post('/cashkicks', (req, res) => {
  const { name, rate, currencyCode, contracts, maturity, totalRecieved, totalFinanced, status } = req.body;
  let { payBackAmount } = req.body
  const db = router.db; // LowDB instance

  // Check if required fields are provided
  if (!name || !contracts || !Array.isArray(contracts) || !currencyCode) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  // Create the new cashkick in the exact format specified
  const newCashkick = {
    id: Date.now().toString(), // Convert to string to match format
    name,
    status: status || 'FUNDED', // Use provided status or default to FUNDED
    maturity: maturity || format(add(new Date(), { years: 1 }), 'MMMM d, yyyy'),
    rate: rate || 12, // Use provided rate or default to 12
    currencyCode: currencyCode,
    totalRecieved: totalRecieved || Math.round((payBackAmount || 0) * 0.88), // Amount received (after 12% fee)
    totalFinanced: totalFinanced || Math.round(payBackAmount || 0), // Total financed amount
  };

  // Update the contracts' status to 'UNAVAILABLE'
  contracts.forEach(contractId => {
    const contract = db.get('contracts').find({ id: contractId }).value();
    if (contract) {
      db.get('contracts')
        .find({ id: contractId })
        .assign({ status: 'UNAVAILABLE' })
        .write();
    }
  });

  // Subtract totalFinanced from availableCreditAmount in credit
  const credit = db.get('credit').value()[0];
  if (credit && totalFinanced) {
    const updatedAvailableCreditAmount = credit.availableCreditAmount - totalFinanced;
    db.get('credit')
      .find({ totalAmount: credit.totalAmount })
      .assign({ availableCreditAmount: updatedAvailableCreditAmount })
      .write();
  }

  // Add the new cashkick to the database
  db.get('cashkicks')
    .push(newCashkick)
    .write();

  res.status(201).json(newCashkick);
});

server.use(router);
server.listen(3000, () => {
  console.log('JSON Server is running on port 3000');
});
