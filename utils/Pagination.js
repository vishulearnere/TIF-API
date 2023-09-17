export const pagination = async(req,length) =>{
  // Pagination
  const meta = {}
  meta.total = length
  meta.pages = Math.ceil(meta.total / 10)
  meta.page = req.query.page || 1
  const start = (meta.page - 1) * 10
  const last = meta.page * 10

  return {meta,start,last}
}
