export default function stripPostTitle() {
  return (tree, file) => {
    // Only posts take their page title from frontmatter.
    if (!file.path?.replaceAll('\\', '/').includes('/content/blog/')) return;
    const firstTitle = tree.children.findIndex((node) => node.type === 'heading' && node.depth === 1);
    if (firstTitle !== -1) tree.children.splice(firstTitle, 1);
  };
}
