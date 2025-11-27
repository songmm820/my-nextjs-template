import { Resend, type CreateEmailOptions } from 'resend'
import EmailTemplate from '~/shared/components/EmailTemplate'

// resend_key @see https://resend.com/api-keys
const RESEND_KEY: string = 're_DSrH219u_JCeUNsUB5EXeCpeDHcHeWxPi'

const resend = new Resend(RESEND_KEY)

type SendEmailType = {} & Omit<CreateEmailOptions, 'react'>

/**
 * 发送邮件
 *
 * @param options 发送配置
 */
export async function sendEmail(options: SendEmailType) {
  const { from, to, subject, text } = options
  if (!from || !to || !subject || !text) throw new Error('Invalid email options')
  await resend.emails.send({
    from: from,
    to: to,
    subject: subject,
    react: EmailTemplate({
      title: '一封邮件',
      description: '这是一封测试邮件。'
    })
  })
}
