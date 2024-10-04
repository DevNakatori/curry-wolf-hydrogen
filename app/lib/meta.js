// https://gist.github.com/ryanflorence/ec1849c6d690cfbffcb408ecd633e069

export const mergeMeta = (leafMetaFn) => {
  return (arg) => {
    const leafMeta = leafMetaFn(arg);
    return arg.matches.reduceRight((acc, match) => {
      for (const parentMeta of match.meta) {
        const index = acc.findIndex(
          (meta) => JSON.stringify(meta) === JSON.stringify(parentMeta),
        );
        if (index == -1) {
          // Parent meta not found in acc, so add it
          acc.push(parentMeta);
        }
      }
      return acc;
    }, leafMeta);
  };
};
