import express from 'express';
import helmet from 'helmet'
import bodyParser from 'body-parser'
import * as nodemailer from 'nodemailer'
import mjml2html from 'mjml';
import * as Handlebars from 'handlebars';
import cors from 'cors'

const app = express();

// add some security-related headers to the response
app.use(helmet());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(cors());

app.post('*', async (req, res) => {

    const transportMailer = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'steeve@foxlabs.io',
            pass: 'Mishibebe69'
        }
    })

    try {

        const reservation: any = req.body;

        const htmlOutput = mjml2html(`<mjml>
  <mj-head>
    <mj-font name="Dosis" href="https://fonts.googleapis.com/css?family=Dosis" />
  </mj-head>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-image width="150px" src="http://playa.pericosrentcar.online/img/periquito.7f207577.png"></mj-image>
      </mj-column>

      <mj-column></mj-column>

      <mj-column>
        <mj-text font-size="20px" color="#000000" font-family="Ubuntu">Reservation</mj-text>
        <mj-text font-size="18px" color="#000000" font-family="Ubuntu">Folio: {{folio}}</mj-text>
        <mj-divider border-color="#0519C5"></mj-divider>
      </mj-column>
    </mj-section>
    <mj-section>
      <mj-column>
        <mj-text font-size="20px" color="#000000" font-family="Ubuntu">Cliente/Customer: {{customer}}</mj-text>
        <mj-divider border-color="#0519C5"></mj-divider>
      </mj-column>
    </mj-section>
    <mj-section>
      <mj-column>
        <mj-text font-size="15px" color="#000000" font-family="Ubuntu">Auto/Car: {{car}} </mj-text>
        <mj-divider border-color="#0519C5"></mj-divider>
      </mj-column>
      <mj-column>
        <mj-text font-size="15px" color="#000000" font-family="Ubuntu">Fecha/Date: {{date}} </mj-text>
        <mj-divider border-color="#0519C5"></mj-divider>
      </mj-column>
      <mj-column>
        <mj-text font-size="15px" color="#000000" font-family="Ubuntu">Hora/Hour: {{hour}} </mj-text>
        <mj-divider border-color="#0519C5"></mj-divider>
      </mj-column>
    </mj-section>
    <mj-section>
      <mj-column>
        <mj-text font-size="18px" color="#000000" font-family="Ubuntu">Hotel: {{hotel}}</mj-text>
        <mj-divider border-color="#0519C5"></mj-divider>
      </mj-column>
      <mj-column>
        <mj-text font-size="18px" color="#000000" font-family="Ubuntu">Teléfono/Phone: {{phone}} </mj-text>
        <mj-divider border-color="#0519C5"></mj-divider>
      </mj-column>
    </mj-section>
    <mj-section>
      <mj-column>
        <mj-text font-size="13px" color="#000000" font-family="Ubuntu">Adelanto/Advancenment: {{advancement}}</mj-text>
        <mj-divider border-color="#0519C5"></mj-divider>
      </mj-column>
      <mj-column>
        <mj-text font-size="15px" color="#000000" font-family="Ubuntu">Días/Days: {{days}}</mj-text>
        <mj-divider border-color="#0519C5"></mj-divider>
      </mj-column>
      <mj-column>
        <mj-text font-size="15px" color="#000000" font-family="Ubuntu">Total: {{total}} </mj-text>
        <mj-divider border-color="#0519C5"></mj-divider>
      </mj-column>
    </mj-section>
    <mj-section>
      <mj-column>
        <mj-text font-size="20px" color="#000000" font-family="Ubuntu">Notas: {{notes}}</mj-text>
        <mj-divider border-color="#0519C5"></mj-divider>
      </mj-column>
      <mj-column>
        <mj-text font-size="15px" color="#000000" font-family="Ubuntu">Tel: +52 (984) 873 19 05</mj-text>

      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`)

        const result = Handlebars.compile(htmlOutput.html)
        const newHtml = result({folio: reservation.folio,
            customer: reservation.customer,
            car: reservation.car,
            date: reservation.date,
            hour: reservation.hour,
            hotel: reservation.hotel,
            phone: reservation.phone,
            advancement: reservation.advancement,
            days: reservation.days,
            total: reservation.total,
            notes: reservation.notes
        })
        const mailOptions = {
            from: `Pericos RentCar <${reservation.email}>`, // sender address
            to: reservation.email,//reservation.email, // list of receivers
            subject: `Se ha realizado una reservación ${reservation.customer}`, // Subject line
            html: newHtml, // plain text body
        };

        const mailResponse = await transportMailer.sendMail(mailOptions);

        res.status(200).send({
            status: true,
            message: 'Se ha enviado el email con éxito.',
            payload: reservation,
            html: newHtml
        })
    } catch (e) {
        res.status(400).send({
            status: false,
            message: e.message,
        })
    }
})

export default app;

