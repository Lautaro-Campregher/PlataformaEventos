import transporter from "../config/mailer.js";

class MailService {
  async sendTicketConfirmation({ email, event, ticket }) {
    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: email,
      subject: `Inscripción confirmada: ${event.title}`,
      html: `
        <h2>Inscripción confirmada</h2>

        <p>Tu inscripción fue confirmada correctamente.</p>

        <h3>Datos del evento</h3>

        <p><strong>Evento:</strong> ${event.title}</p>
        <p><strong>Fecha:</strong> ${new Date(event.date).toLocaleString("es-AR")}</p>
        <p><strong>Ubicación:</strong> ${event.location}</p>

        <h3>Datos de la inscripción</h3>

        <p><strong>Cantidad:</strong> ${ticket.quantity}</p>
        <p><strong>Código de reserva:</strong> ${ticket.reservationCode}</p>

        <p>¡Gracias por inscribirte!</p>
      `,
    });
  }
}

export default new MailService();
