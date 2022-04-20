import m from 'mithril';
import { renderMarkdown } from '../util';

const content = `
# newt
\`newt\` is a Firefox browser extension designed to let you decorate your new tab with bits of personal [Markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet).

\`newt\` is distributed under the [GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.en.html). It's sourcecode can be found on [Github](https://github.com/kevinfiol/newt).

To get started, enter \`Edit Mode\`, right-click anywhere in the space, and start adding boxes. Your changes are stored in your browser, and can also be exported to JSON in the Options menu.
`;

export const About = () => ({
    view: () =>
        m('div.about',
            m.trust(renderMarkdown(content))
        )
});