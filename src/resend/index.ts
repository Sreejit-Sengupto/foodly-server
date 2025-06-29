import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export const sendMail = async (
  email: string,
  subject: string,
  emailTemplate: string,
) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject,
      html: emailTemplate,
    });

    if (error) {
      console.log(error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error(error);
  }
};
