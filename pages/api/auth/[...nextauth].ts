import NextAuth from 'next-auth'
import { authOptions } from '@/src/lib/auth'

// @see ./lib/auth
export default NextAuth(authOptions)
