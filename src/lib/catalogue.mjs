// Keep each shelf represented even when one category has more recent arrivals.
export function latestShelfPapers(papers, shelf, limit = 5) {
  const unique = new Map();
  for (const paper of [...papers].sort((a,b)=>b.published.localeCompare(a.published))) {
    if (paper.shelf !== shelf || paper.id.startsWith('upload-')) continue;
    const id=paper.id.replace(/v\d+$/, '');
    if (!unique.has(id)) unique.set(id, paper);
  }
  return [...unique.values()].slice(0,limit);
}
