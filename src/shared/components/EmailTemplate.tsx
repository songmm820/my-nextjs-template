type EmailTemplateProps = {
  title: string
  description: string
}

const EmailTemplate = (props: EmailTemplateProps) => {
  const { title, description } = props
  return (
    <div>
      <h1>Welcome, {title}!</h1>
      <p>{description}</p>
    </div>
  )
}

export default EmailTemplate
