'use client'

import clsx from 'clsx'
import dynamic from 'next/dynamic'
import PageContainer from '~/shared/components/PageContainer'

const Editor = dynamic(() => import('~/shared/components/Editor'), { ssr: false })

const PostCreatePage = () => {
  return (
    <PageContainer autoHeight={false}>
      <div className={clsx('w-full h-full flex flex-col items-center py-6 rounded-2xl bg-white')}>
        <Editor />
      </div>
    </PageContainer>
  )
}

export default PostCreatePage
