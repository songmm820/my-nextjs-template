'use client'

import clsx from 'clsx'
import dynamic from 'next/dynamic'
import { useRef } from 'react'
import { useCreatePostSwrApi } from '~/apis/post-api'
import PageContainer from '~/shared/components/PageContainer'
import { Button, Form, FormField, Input, Textarea } from '~/shared/features'
import { type FormRef } from '~/shared/features/internal/Form'
import { postCreateDTOSchema, type PostCreateDTOSchema } from '~/shared/zod-schemas/post.schema'

const Editor = dynamic(() => import('~/shared/components/Editor'), { ssr: false })

const PostCreatePage = () => {
  const formRef = useRef<FormRef<PostCreateDTOSchema>>(null)

  const { trigger } = useCreatePostSwrApi()

  const handleSave = async () => {
    const isV = await formRef.current?.validate()
    if (!isV) return
    const formData = formRef.current?.getFormValues()
    if (!formData) return
    trigger(formData)
  }

  const handleReset = () => {
    formRef.current?.reset()
  }

  return (
    <PageContainer autoHeight={false}>
      <div
        className={clsx(
          'w-full h-full flex flex-col items-center py-6 rounded-2xl bg-white relative'
        )}
      >
        <div className="w-138 flex-1 overflow-auto">
          <Form<PostCreateDTOSchema> ref={formRef} schema={postCreateDTOSchema}>
            <FormField<PostCreateDTOSchema> name="title" label="Post Title">
              <Input placeholder="Please enter title" />
            </FormField>
            <FormField<PostCreateDTOSchema> name="summary" label="Summary">
              <Textarea placeholder="Please enter summary" />
            </FormField>
            <FormField<PostCreateDTOSchema> name="content" label="Content">
              <Textarea placeholder="Please enter content" />
            </FormField>
          </Form>
        </div>

        <div className="w-full h-18 px-8 border-t border-dashed border-e7">
          <PostCreateActionButtonsArea onReset={handleReset} onSave={handleSave} />
        </div>
      </div>
    </PageContainer>
  )
}

type PostCreateActionButtonsAreaProps = {
  onReset?: () => void
  onSaveDraft?: () => void
  onSave?: () => void
}

const PostCreateActionButtonsArea = (props: PostCreateActionButtonsAreaProps) => {
  const { onReset, onSaveDraft, onSave } = props
  return (
    <div className="w-full h-full flex items-center justify-center gap-4">
      <Button className="h-9" variant="default" onClick={onReset}>
        Reset
      </Button>
      <Button className="h-9" variant="outline" onClick={onSaveDraft}>
        Save Draft
      </Button>
      <Button className="h-9" variant="primary" onClick={onSave}>
        Save
      </Button>
    </div>
  )
}

export default PostCreatePage
