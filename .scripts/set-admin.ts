import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.update({
    where: { email: 'erictg96@gmail.com' },
    data: { role: 'ADMIN' },
  })

  console.log('✅ User updated:', user.email, 'Role:', user.role)
}

main()
  .catch(e => {
    console.error('❌ Error:', e.message)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
