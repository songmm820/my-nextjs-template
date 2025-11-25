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
    <div className="mt-20 w-100 mx-auto">
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormField name="email" label="Please input your email">
          <Input
            type="text"
            id="email"
            placeholder="Email"
            {...register('email')}
            autoComplete="on"
          />
        </FormField>

        {/* {errors.email && <span className="error">{errors.email.message}</span>} */}
        <FormField name="email" label="Please input your email">
          <Input
            type="password"
            placeholder="Password"
            autoComplete="on"
            {...register('password')}
          />
          {errors.password && <span className="error">{errors.password.message}</span>}
        </FormField>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Logging in...' : 'Login'}
        </Button>

        <div className="mt-4 flex gap-3">
          <Button>BT0</Button>
          <Button variant="primary">BT1</Button>
          <Button variant='outline'>BT1</Button>
        </div>
      </Form>
    </div>
  )
}

export default SignInPage
