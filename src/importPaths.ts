import { join } from 'path';

/*
  import paths won't match the context of the test runner
  fixImportPaths will replace paths with absolute paths
*/

// import or require statement
const importPathRegex =
 /require\(["'](BASE.+)["']\)([a-zA-Z0-9\-\_]+)?|^import.+?\s?["'](BASE.+)["'];?$/m;
const relativePathRegex = /^BASE/;

export default function fixImportPaths({dir, content}): string {
  return content.split('\n').map(line => {
    // line has an import or require ?
    const isMatch = line.match(importPathRegex);
    if (!isMatch) {
      return line;
    }
    // multiple cases due to import or require regex
    let importPath = isMatch[1] || isMatch[2] || isMatch[3];
    // import path: may be relative or absolute

    // is a relative path
    if (importPath.match(relativePathRegex)) {
      let newPath = join(dir, importPath.replace('BASE', ''))
        // fix windows paths
        .split('\\').join('\\\\');
      return line.replace(importPath, newPath);
    }
		// no match, return line
    return line;
  }).join('\n');
}
