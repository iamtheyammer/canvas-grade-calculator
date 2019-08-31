const sort = (a, b) => {
  const al = a.toLocaleLowerCase();
  const bl = b.toLocaleLowerCase();
  if(al < bl) return -1;
  if(al > bl) return 1;
  return 0;
};

export const desc = sort;

export const asc = (a, b) => sort(b, a);
