import { axiosInstance } from '~/shared/config/axios-config'
import { createSwrMutation } from '~/shared/config/swr'
import { type PostCreateDTOSchema } from '~/shared/zod-schemas/post.schema'

// 新增文章信息
const createPostApiUrl = '/api/post/create'
const createPostApi = (p: PostCreateDTOSchema) => {
  return axiosInstance.post<PostCreateDTOSchema, void>(createPostApiUrl, p)
}
export const useCreatePostSwrApi = createSwrMutation<PostCreateDTOSchema, void>(
  createPostApiUrl,
  createPostApi
)
