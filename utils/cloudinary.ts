export function getCloudinaryPath(fullUrl: string) {
  const base = 'https://res.cloudinary.com/dj6we26m8/image/upload/'
  return fullUrl.replace(base, '')
}