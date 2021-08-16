const sgMail = require("@sendgrid/mail");

export const sendMail = (
  email: string,
  dynamic_template_date: any,
  template_id: string
) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    personalizations: [
      {
        to: [
          {
            email: email,
          },
        ],
        dynamic_template_data: dynamic_template_date,
      },
    ],
    from: {
      email: "shreynpatel23@gmail.com",
      name: "Murf Support",
    },
    reply_to: {
      email: "shreynpatel23@gmail.com",
      name: "Murf Support",
    },
    template_id: template_id,
  };
  sgMail
    .send(msg)
    .then((res) => res)
    .catch((err) => err);
};
