'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AuthSignSchema, type AuthSignSchemaType } from '~/shared/zod-schemas/auth.schema'

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
    <div className="mt-20">
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="email">Email</label>
        <input type="text" id='email' placeholder="Email" {...register('email')} autoComplete='on'/>
        <br />
        {errors.email && <span className="error">{errors.email.message}</span>}

        <input type="password" placeholder="Password" autoComplete="on" {...register('password')} />
        {errors.password && <span className="error">{errors.password.message}</span>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  )
}

export default SignInPage
