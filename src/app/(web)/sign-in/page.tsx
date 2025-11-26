'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AuthSignSchema, type AuthSignSchemaType } from '~/shared/zod-schemas/auth.schema'
import { Button, Form, FormField, Input } from '~/shared/features'

const SignInPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<AuthSignSchemaType>({
    resolver: zodResolver(AuthSignSchema),
    mode: 'onBlur'
  })

  const onSubmit = (data: AuthSignSchemaType) => console.log(data)

  return (
    <div className="mt-20 w-100 mx-auto" onSubmit={handleSubmit(onSubmit)}>
      <Form<AuthSignSchemaType>
        defaultValues={{
          email: 'test',
          password: '123123'
        }}
      >
        <FormField<AuthSignSchemaType>
          name="email"
          label="Please input your email"
          showErrorMessage={Boolean(errors.email)}
          errorMessage={errors.email?.message}
        >
          <Input type="text" placeholder="Email" {...register('email')} autoComplete="on" />
        </FormField>

        <FormField<AuthSignSchemaType> name="password" label="Please input your password">
          <Input
            type="password"
            placeholder="Password"
            autoComplete="on"
            {...register('password')}
          />
        </FormField>

        <Button className="mt-6" type="submit" variant="primary" block disabled={isSubmitting}>
          {isSubmitting ? 'Logging in...' : 'Sign In'}
        </Button>
      </Form>
    </div>
  )
}

export default SignInPage
