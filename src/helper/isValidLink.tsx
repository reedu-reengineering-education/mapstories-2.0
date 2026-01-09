export function isValidLink(link: string) {
  // Regular expression zur Überprüfung von URLs
  const urlRegEx = /^(ftp|http|https):\/\/[^ "]+$/

  // Überprüfung des Strings gegen die RegEx
  return urlRegEx.test(link)
}
