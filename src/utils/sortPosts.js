export function sortPosts(postsArray) {
  return [...postsArray].sort(
    (a, b) => new Date(b.$createdAt) - new Date(a.$createdAt)
  );
}
