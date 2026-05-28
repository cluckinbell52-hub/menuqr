import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'menuqr-secret-key-2024'

export function createToken(vendorId) {
  return jwt.sign({ vendorId }, SECRET, { expiresIn: '7d' })
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET)
  } catch {
    return null
  }
}