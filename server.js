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
  const { name, rate, currencyCode, contracts } = req.body;
  let { payBackAmount } = req.body
  const db = router.db; // LowDB instance

  // Check if name and contracts array are provided
  if (!name || !contracts || !Array.isArray(contracts) || !payBackAmount || !rate || !currencyCode) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  payBackAmount = parseFloat(payBackAmount.toFixed(2))

  // Calculate the date one year from now and format it
  const oneYearFromNow = add(new Date(), { years: 1 });
  const formattedMaturityDate = format(oneYearFromNow, 'MMMM d, yyyy');

  // Create the new cashkick
  const newCashkick = {
    id: Date.now(), // Simple unique ID generator
    name,
    status: 'PENDING',
    maturity: formattedMaturityDate,
    rate: 12,
    currencyCode: currencyCode,
    totalRecieved: payBackAmount - (payBackAmount * rate) / 100,
    totalFinanced: payBackAmount,
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
  if (credit) {
    const updatedAvailableCreditAmount = credit.availableCreditAmount - payBackAmount;
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
server.listen(3001, () => {
  console.log('JSON Server is running on port 3001');
});
