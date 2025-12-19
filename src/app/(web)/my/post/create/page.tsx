'use client'

import clsx from 'clsx'
import dynamic from 'next/dynamic'
import { useRef } from 'react'
import { useCreatePostSwrApi } from '~/apis/post-api'
import { DynamicPermissionEnum } from '~/generated/prisma/enums'
import PageContainer from '~/shared/components/PageContainer'
import {
  Button,
  Form,
  FormField,
  Input,
  ModalManager,
  Radio,
  type RadioOptionItemType,
  Textarea
} from '~/shared/features'
import { type FormRef } from '~/shared/features/internal/Form'
import { postCreateInput, type PostCreateInputType } from '~/shared/zod-schemas/post.schema'

const Editor = dynamic(() => import('~/shared/components/Editor'), { ssr: false })

// 动态权限枚举
const DynamicPermissionEnumObjInfo = {
  [DynamicPermissionEnum.ALL]: {
    label: 'All',
    description: 'Anyone One'
  },
  [DynamicPermissionEnum.FOLLOWERS]: {
    label: 'Followers',
    description: 'Only Your Followers'
  },
  [DynamicPermissionEnum.SELF]: {
    label: 'Self',
    description: 'Only You'
  }
}

const options: Array<RadioOptionItemType> = Object.entries(DynamicPermissionEnumObjInfo).map(
  ([key, value]) => ({
    label: value.label,
    description: value.description,
    value: key as DynamicPermissionEnum
  })
)

const PostCreatePage = () => {
  const formRef = useRef<FormRef<PostCreateInputType>>(null)

  const { trigger, isMutating } = useCreatePostSwrApi()

  const handleSave = async () => {
    if (isMutating) {
      ModalManager.warning('Please wait for a minute ...')
      return
    }
    const isV = await formRef.current?.validate()
    if (!isV) return
    ModalManager.confirm({
      title: 'Confirm',
      content: 'Are you sure to create this post?',
      okCallback: async () => {
        const formData = formRef.current?.getFormValues()
        if (!formData) return
        const { error } = await trigger(formData)
        if (!error) {
          ModalManager.success('Post created successfully')
        }
      }
    })
  }

  const handleReset = () => {
    formRef.current?.reset()
  }

  return (
    <PageContainer autoHeight={false}>
      <div
        className={clsx(
          'w-full h-full flex flex-col items-center py-6 rounded-2xl bg-white relative overflow-auto'
        )}
      >
        <div className="w-138 flex-1">
          <Form<PostCreateInputType>
            initialValues={{
              title: '测试title',
              tag: '#测试tag',
              summary: '测试summary',
              content: '测试content',
              visibility: DynamicPermissionEnum.ALL,
              isPinned: true
            }}
            ref={formRef}
            schema={postCreateInput}
          >
            <FormField<PostCreateInputType> name="title" label="Post Title">
              <Input placeholder="Please enter title" />
            </FormField>
            <FormField<PostCreateInputType> name="tag" label="Tag">
              <Textarea placeholder="Please enter tag" />
            </FormField>
            <FormField<PostCreateInputType> name="summary" label="Summary">
              <Textarea placeholder="Please enter summary" />
            </FormField>
            <FormField<PostCreateInputType> name="content" label="Content">
              <Textarea placeholder="Please enter content" />
            </FormField>
            <FormField<PostCreateInputType> name="visibility" label="Visibility">
              <Radio options={options} />
            </FormField>
            <FormField<PostCreateInputType> name="isPinned" label="Content">
              <Radio
                options={[
                  {
                    label: 'Pinned',
                    value: true
                  },
                  {
                    label: 'Not Pinned',
                    value: false
                  }
                ]}
              />
            </FormField>
          </Form>
        </div>

        <div className="mt-6 w-full py-4 shrink-0 px-8">
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
