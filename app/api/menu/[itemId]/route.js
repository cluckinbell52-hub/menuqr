import { connectDB } from '@/lib/mongodb'
import { MenuItem } from '@/lib/models'

export async function PATCH(req, { params }) {
  try {
    await connectDB()
    const { itemId } = await params
    const body = await req.json()
    const item = await MenuItem.findByIdAndUpdate(itemId, { $set: body }, { new: true })
    return Response.json(item)
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB()
    const { itemId } = await params
    await MenuItem.findByIdAndDelete(itemId)
    return Response.json({ success: true })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}