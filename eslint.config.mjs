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
      // 关闭react/react-in-jsx-scope报错
      'react/react-in-jsx-scope': 'off',
      // 警告：禁止使用 debugger
      'no-debugger': 'warn',
      // 使用单引号,除了属性值
      quotes: ['error', 'single', { avoidEscape: true }],
      // console 警告
      'no-console': 'warn',
      // 关闭单个文件仅只能导出一个组件的规则
      'react-refresh/only-export-components': 'off',
      // 注释前后需要空格
      'spaced-comment': ['error'],
      // 禁止尾随逗号
      'comma-dangle': ['error', 'never'],
      // 警告未使用的变量
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      // 数组声明的方式 Array<T>
      '@typescript-eslint/array-type': ['error', { default: 'generic' }],
      // 禁止 for in 数组
      '@typescript-eslint/no-for-in-array': 'error',
      // 禁止空对象类型
      '@typescript-eslint/no-empty-object-type': 'warn',
      // tab 键使用 4 个空格
      indent: ['error', 2, { SwitchCase: 1 }],
      // 类型导入方式
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports', // 使用 import type 语法
          fixStyle: 'inline-type-imports' // 强制合并为单条导入（禁止分离）
        }
      ],
      // 禁止相对路径引入
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['*/../*', '../*/*'],
              message: 'Prohibit the use of relative paths.'
            }
          ]
        }
      ]
    }
  },
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts'
  ])
])

export default eslintConfig
