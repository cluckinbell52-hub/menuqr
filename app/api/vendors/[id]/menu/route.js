import { connectDB } from '@/lib/mongodb'
import { Vendor, MenuItem } from '@/lib/models'

export async function GET(req, { params }) {
  try {
    await connectDB()
    const { id } = await params
    const vendor = await Vendor.findById(id)
    const items = await MenuItem.find({ vendorId: id })
    return Response.json({ vendor, items })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req, { params }) {
  try {
    await connectDB()
    const { id } = await params
    const body = await req.json()
    const item = await MenuItem.create({ ...body, vendorId: id })
    return Response.json(item)
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}