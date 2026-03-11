export interface Folder {
  _id: string
  name: string
  parentId: string | null
  createdAt: string
  updatedAt: string
  children: Folder[]
}
