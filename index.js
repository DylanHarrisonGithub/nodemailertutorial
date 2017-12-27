const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

// view engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// bodyparser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.render('contact');
});

app.post('/send', (req, res) => {
    const output = `
        <p>You have a new contact request</p>
        <h3>Contact Details</h3>
        <ul>
            <li>Name: ` + req.body.name + `</li>
            <li>Company: ` + req.body.company + `</li>
            <li>Email: ` + req.body.email + `</li>
            <li>Phone: ` + req.body.phone + `</li>
        </ul>
        <h3>Message</h3>
        <p>` + req.body.message + `</p>
    `;

    let transporter = nodemailer.createTransport({
        // suply valid email service user and pass
        service: "",
        auth: {
            user: "",
            pass: ""
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '', // sender address
        to: req.body.email, // list of receivers
        subject: 'nodemailertest', // Subject line
        text: 'Hello world?', // plain text body
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });

});

app.listen(3000, () => console.log('server started on port 3000'));
