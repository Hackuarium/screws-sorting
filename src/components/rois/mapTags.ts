export function mapTags(data) {
  // must contain a tag
  data = data.filter(
    (datum: any) =>
      datum.tag &&
      typeof datum.tag.row === 'number' &&
      typeof datum.tag.column === 'number',
  );

  // sort by tag row and then column
  data.sort((a: any, b: any) => {
    if (a.tag.row === b.tag.row) {
      return a.tag.column - b.tag.column;
    }
    return a.tag.row - b.tag.row;
  });
}
