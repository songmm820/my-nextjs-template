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
    label: '全部',
    description: '任何人可见'
  },
  [DynamicPermissionEnum.FOLLOWERS]: {
    label: '仅关注',
    description: '仅关注者可见'
  },
  [DynamicPermissionEnum.SELF]: {
    label: '尽自己',
    description: '仅自己可见'
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
      ModalManager.warning('请稍后再试...')
      return
    }
    const isV = await formRef.current?.validate()
    if (!isV) return
    ModalManager.confirm({
      title: '创建文章',
      content: '确定要创建这篇文章吗？',
      okCallback: async () => {
        const formData = formRef.current?.getFormValues()
        if (!formData) return
        const { error } = await trigger(formData)
        if (!error) {
          ModalManager.success('文章创建成功')
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
            <FormField<PostCreateInputType> name="title" label="文章标题">
              <Input />
            </FormField>
            <FormField<PostCreateInputType> name="tag" label="文章标签">
              <Textarea />
            </FormField>
            <FormField<PostCreateInputType> name="summary" label="文章摘要">
              <Textarea />
            </FormField>
            <FormField<PostCreateInputType> name="content" label="文章内容">
              <Textarea />
            </FormField>
            <FormField<PostCreateInputType> name="visibility" label="文章权限">
              <Radio options={options} />
            </FormField>
            <FormField<PostCreateInputType> name="isPinned" label="是否置顶">
              <Radio
                options={[
                  {
                    label: '是',
                    value: true
                  },
                  {
                    label: '否',
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
  onSave?: () => void
}

const PostCreateActionButtonsArea = (props: PostCreateActionButtonsAreaProps) => {
  const { onReset, onSave } = props
  return (
    <div className="w-full h-full flex items-center justify-center gap-4">
      <Button variant="default" onClick={onReset}>
        重置
      </Button>

      <Button variant="primary" onClick={onSave}>
        发布
      </Button>
    </div>
  )
}

export default PostCreatePage
