import * as appRoot from 'app-root-path';
import * as del from 'del';
import * as fs from 'fs-extra';
import * as glob from 'glob';
import * as path from 'path';
import svgr from '@svgr/core';
import { promisify } from 'util';
import { EOL } from 'os';
import { exec } from 'child_process';
import { pascalCase } from 'pascal-case';

(async () => {
  const root = path.join(path.resolve());
  const dist = path.join(root, 'public', 'undraw');
  const components = path.join(root, 'src', 'common', 'components', 'toto');
  console.log(appRoot.path)
  const pattern = path.join(appRoot.path, 'undraw', '**', '*.svg');
  const files = glob.sync(pattern);
  const imports = [];
  const exports = [];
  const maps = [];

  console.log('Generating unDraw components ...');

  // remove existing
  del.sync(dist, { force: true });
  del.sync(components, { force: true });

  for (const file of files) {
    const filename = path.basename(file).split('.')[0];
    const componentName = 'Undraw' + pascalCase(filename);
    const src = fs.readFileSync(file);
    const dest = join(components, `${componentName}.tsx`);

    const content = await svgr(
      src,
      {
        icon: true,
        plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx', '@svgr/plugin-prettier'],
        replaceAttrValues: {
          '#6c63ff': '{primaryColor}',
        },
        svgProps: {
          style: '{styleProps}',
        },
        template: svgrTemplate,
      },
      { componentName }
    );

    fs.outputFileSync(dest, content);
    console.log(`Component built: "${componentName}"`);

    imports.push(`import ${componentName} from './${componentName}';`);
    exports.push(`export { default as ${componentName} } from './${componentName}';`);
    maps.push(`'${filename}': ${componentName},`);
  }

  const dest = join(components, 'index.ts');
  let content = '';

  if (imports.length > 0) {
    content += imports.join(EOL);
    content += EOL;
    content += EOL;
  }

  if (exports.length > 0) {
    content += exports.join(EOL);
    content += EOL;
    content += EOL;
  }

  content += 'export default {';

  if (maps.length > 0) {
    content += EOL;
    content += maps.join(EOL);
    content += EOL;
  }

  content += '};';
  content += EOL;

  fs.outputFileSync(dest, content);

  // compile typescript
  const promiseExec = promisify(exec);
  await promiseExec('tsc -p ./tsconfig.json', { cwd: root });

  console.log('Done!');
})();

/**
 * Custom svgr template.
 */
function svgrTemplate(api, opts, state) {
  const { template } = api;
  const { componentName, jsx } = state;
  const typeScriptTpl = template.smart({ plugins: ['typescript'] });

  return typeScriptTpl.ast`
    import * as React from 'react';
    function ${componentName}(p: any) {
      const { primaryColor, height, style, ...props } = p;
      const styleProps = { width: '100%', height, ...style };
      return (${jsx});
    };
    export default ${componentName};
  `;
}