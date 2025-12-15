import { axiosInstance } from '~/shared/config/axios-config'
import { createSwrMutation } from '~/shared/config/swr'
import { type PostCreateInputType } from '~/shared/zod-schemas/post.schema'

// 新增文章信息
const createPostApiUrl = '/api/post/create'
const createPostApi = (p: PostCreateInputType) => {
  return axiosInstance.post<PostCreateInputType, void>(createPostApiUrl, p)
}
export const useCreatePostSwrApi = createSwrMutation<PostCreateInputType, void>(
  createPostApiUrl,
  createPostApi
)
