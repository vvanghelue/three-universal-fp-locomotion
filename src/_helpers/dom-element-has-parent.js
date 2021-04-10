export default function hasParent({ node, searchParent }) {
  let current = node
  while (current.parentNode != null && current.parentNode != document.documentElement) {
    if (current === searchParent) {
      return true
    }
    current = current.parentNode
  }
  return false
}
