'use client'

import { useRef, useState } from 'react'
import z from 'zod'
import { Button, CheckBox, Form, FormField, Input, Modal, Radio } from '~/shared/features'
import { type FormRef } from '~/shared/features/internal/Form'

export const paramsInput = z
  .object({
    day: z.string({
      message: '请选择一个星期'
    }),
    days: z.array(z.string(), {
      message: '请选择多个星期'
    })
  })
  .strict()
type ParamsInput = z.infer<typeof paramsInput>

const AboutPage = () => {
  const formRef = useRef<FormRef<ParamsInput>>(null)
  const [checkboxValue, setCheckboxValue] = useState<Array<string>>([])
  const [radioValue, setRadioValue] = useState<string>('1')
  const [inputValue, setInputValue] = useState('今天')
  const [openModal, setOpenModal] = useState(false)

  return (
    <div className="h-auto w-120 mx-auto flex flex-col justify-center gap-4">
      <Button onClick={() => setOpenModal(true)}>Open Modal</Button>
      <Modal title="Setting" open={openModal} onClose={() => setOpenModal(false)}>
        <div className="h-300">123132123</div>
      </Modal>

      <CheckBox
        value={checkboxValue}
        onChange={(v) => setCheckboxValue(v)}
        options={[
          {
            label: '星期一',
            value: '1',
            description: '今天是星期一'
          },
          {
            label: '星期二',
            value: '2',
            description: '今天是星期二'
          },
          {
            label: '星期三',
            value: '3',
            description: '今天是星期三'
          },
          {
            label: '星期四',
            value: '4',
            description: '今天是星期四'
          }
        ]}
      />
      <hr />
      <Radio
        value={radioValue}
        onChange={(v) => setRadioValue(v)}
        options={[
          {
            label: '星期一',
            value: '1',
            description: '今天是星期一'
          },
          {
            label: '星期二',
            value: '2',
            description: '今天是星期二'
          }
        ]}
      />

      <Input value={inputValue} onChange={(v) => setInputValue(v)} />

      <Form<ParamsInput> ref={formRef} schema={paramsInput} initialValues={{}}>
        <FormField<ParamsInput> name="day" label="Radio">
          <Radio
            options={[
              {
                label: '星期一',
                value: '1',
                description: '今天是星期一'
              },
              {
                label: '星期二',
                value: '2',
                description: '今天是星期二'
              },
              {
                label: '星期三',
                value: '3',
                description: '今天是星期三'
              },
              {
                label: '星期四',
                value: '4',
                description: '今天是星期四'
              },
              {
                label: '星期五',
                value: '5',
                description: '今天是星期五'
              },
              {
                label: '星期六',
                value: '6',
                description: '今天是星期六'
              }
            ]}
          />
        </FormField>

        <hr />

        <FormField<ParamsInput> name="days" label="CheckBox">
          <CheckBox
            options={[
              {
                label: '星期一',
                value: '1',
                description: '今天是星期一'
              },
              {
                label: '星期二',
                value: '2',
                description: '今天是星期二'
              },
              {
                label: '星期三',
                value: '3',
                description: '今天是星期三'
              },
              {
                label: '星期四',
                value: '4',
                description: '今天是星期四'
              }
            ]}
          />
        </FormField>
      </Form>

      <Button
        variant="primary"
        onClick={() => {
          formRef.current?.validate()
        }}
      >
        Submit
      </Button>

      <Button
        className="submit"
        variant="primary"
        onClick={() => {
          formRef.current?.reset()
        }}
      >
        Reset
      </Button>
    </div>
  )
}

export default AboutPage
