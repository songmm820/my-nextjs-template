import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import prettier from 'eslint-config-prettier/flat'

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    prettier,
    // Override default ignores of eslint-config-next.
    {
        rules: {
            //关闭react/react-in-jsx-scope报错
            'react/react-in-jsx-scope': 'off',
            // 警告：禁止使用 console
            'no-console': 'warn',
            // 警告：禁止使用 debugger
            'no-debugger': 'warn',
            // 错误：使用单引号
            quotes: ['error', 'single'],
            // 错误：禁止使用 var
            'no-var': 'error',
            // 警告：禁止使用未定义的变量
            '@typescript-eslint/no-unused-vars': 'warn',
        },
    },
    globalIgnores([
        // Default ignores of eslint-config-next:
        '.next/**',
        'out/**',
        'build/**',
        'next-env.d.ts',
    ]),
])

export default eslintConfig
