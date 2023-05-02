export function generateRandomName() {
  let name = ''
  const possibleChars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < 8; i++) {
    name += possibleChars.charAt(
      Math.floor(Math.random() * possibleChars.length),
    )
  }

  return name
}
