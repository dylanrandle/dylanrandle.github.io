import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { profile } from '../src/data/profile.ts';
import { THEME } from '../src/config.ts';

const RESUME_BASENAME = 'DylanRandleResume';
const RESUME_DIRECTORY = 'resume';
const GENERATE_COMMAND = 'npm run resume:generate';
const LATEX_COMMAND = 'latexmk';
const SOURCE_DATE_EPOCH = '946684800';
const BUILD_DIRECTORY_PREFIX = 'dylan-resume-';
const TEMPLATE_TOKEN_PATTERN = /<<([A-Z][A-Z0-9_]*)>>/g;
const FILE_NAMES = Object.freeze({
  template: `${RESUME_BASENAME}.tex.template`,
  tex: `${RESUME_BASENAME}.tex`,
  pdf: `${RESUME_BASENAME}.pdf`,
});
const SOURCE_BUILD_EXTENSIONS = [
  '.aux',
  '.fdb_latexmk',
  '.fls',
  '.log',
  '.out',
  '.pdf',
  '.synctex.gz',
];

const generatorPath = fileURLToPath(import.meta.url);
const projectRoot = path.resolve(path.dirname(generatorPath), '..');
const resumeDirectory = path.join(projectRoot, RESUME_DIRECTORY);
const publicDirectory = path.join(projectRoot, 'public');
const projectPath = (...segments) => path.join(projectRoot, ...segments);
const publicPath = (rootRelativePath) =>
  path.join(publicDirectory, rootRelativePath.slice(1));
const paths = Object.freeze({
  generator: generatorPath,
  profile: projectPath('src', 'data', 'profile.ts'),
  template: path.join(resumeDirectory, FILE_NAMES.template),
  tex: path.join(resumeDirectory, FILE_NAMES.tex),
  pdf: publicPath(profile.links.cv),
  portrait: publicPath(profile.portrait.src),
  tempRoot: projectPath('tmp', 'pdfs'),
});
const sourceBuildPaths = SOURCE_BUILD_EXTENSIONS.map((extension) =>
  path.join(resumeDirectory, `${RESUME_BASENAME}${extension}`),
);

if (path.posix.basename(profile.links.cv) !== FILE_NAMES.pdf) {
  throw new Error(
    `profile.links.cv must end with ${FILE_NAMES.pdf}; received ${profile.links.cv}.`,
  );
}

const relativeProjectPath = (filePath) =>
  path.relative(projectRoot, filePath).split(path.sep).join('/');
const portraitTexPath = path
  .relative(resumeDirectory, paths.portrait)
  .split(path.sep)
  .join('/');
const templateSource = readFileSync(paths.template, 'utf8');
const profileSource = JSON.stringify(profile);
const profileHash = createHash('sha256').update(profileSource).digest('hex');
const artifactHash = createHash('sha256')
  .update(profileSource)
  .update(JSON.stringify(THEME.resume))
  .update(readFileSync(paths.generator))
  .update(templateSource)
  .update(readFileSync(paths.portrait))
  .digest('hex');
const profileFingerprint = `profile-sha256:${profileHash}`;
const artifactFingerprint = `artifact-sha256:${artifactHash}`;
const escapedPdfFingerprint = [...artifactFingerprint]
  .map((character) => `\\000${character}`)
  .join('');

const pdfHasArtifactFingerprint = (pdf) =>
  pdf.includes(Buffer.from(artifactFingerprint)) ||
  pdf.includes(Buffer.from(escapedPdfFingerprint));

const escapeLatex = (value) => {
  const latexEscapes = {
    '\\': '\\textbackslash{}',
    '&': '\\&',
    '%': '\\%',
    $: '\\$',
    '#': '\\#',
    _: '\\_',
    '{': '\\{',
    '}': '\\}',
    '~': '\\textasciitilde{}',
    '^': '\\textasciicircum{}',
  };

  return String(value)
    .replaceAll('’', "'")
    .replaceAll('–', '--')
    .replaceAll('—', '---')
    .replace(/[\\&%$#_{}~^]/g, (character) => latexEscapes[character])
    .replaceAll('·', '\\textperiodcentered{}');
};

const escapeUrl = (value) =>
  String(value).replaceAll('%', '\\%').replaceAll('#', '\\#');

const latexHexColor = (value) => {
  const match = /^#([0-9a-f]{6})$/i.exec(value);
  if (!match)
    throw new Error(`Expected a six-digit hex color; received ${value}.`);
  return match[1].toUpperCase();
};

const renderItems = (items, indent = '      ') =>
  items.map((item) => `${indent}\\resumeItem{${escapeLatex(item)}}`).join('\n');

const renderExperience = () =>
  profile.resume.experience
    .map((employer) =>
      employer.roles
        .map((role, index) => {
          const heading =
            index === 0
              ? `  \\resumeQuadHeading{${escapeLatex(employer.organization)}}{${escapeLatex(employer.location)}}{${escapeLatex(role.title)}}{${escapeLatex(role.period)}}`
              : `  \\resumeQuadHeadingChild{${escapeLatex(role.title)}}{${escapeLatex(role.period)}}`;

          return `${heading}
    \\resumeItemListStart
${renderItems(role.bullets)}
    \\resumeItemListEnd`;
        })
        .join('\n'),
    )
    .join('\n');

const renderEducationEntry = (entry) =>
  `  \\resumeQuadHeading{${escapeLatex(entry.school)}}{${escapeLatex(entry.location)}}{${escapeLatex(entry.degree)}}{${escapeLatex(entry.period)}}
    \\resumeItemListStart
${renderItems(entry.bullets)}
    \\resumeItemListEnd`;

const renderPublications = () =>
  profile.resume.publications
    .map(
      (publication) =>
        `      \\resumeItem{\\textbf{${escapeLatex(publication.title)}} ${escapeLatex(publication.authors)}. ${escapeLatex(publication.venue)}.}`,
    )
    .join('\n');

const renderProjects = () =>
  profile.resume.projects
    .map(
      (project) =>
        `      \\resumeItem{\\textbf{${escapeLatex(project.title)}} \\textit{(${escapeLatex(project.date)})}: ${escapeLatex(project.description)}}`,
    )
    .join('\n');

const renderSkills = () =>
  profile.resume.skills
    .map(
      (skill) =>
        `      \\resumeItem{\\textbf{${escapeLatex(skill.label)}:} ${escapeLatex(skill.value)}.}`,
    )
    .join('\n');

const contactLinks = [
  ['Website', profile.links.website],
  ['LinkedIn', profile.links.linkedin],
  ['GitHub', profile.links.github],
  ['Scholar', profile.links.scholar],
];
const renderContactLinks = () =>
  contactLinks
    .map(
      ([label, url]) =>
        `  \\href{${escapeUrl(url)}}{\\uline{${escapeLatex(label)}}}`,
    )
    .join(' \\textbf{\\textperiodcentered{}}\n');

const renderTemplate = (source, values) => {
  const tokens = [...source.matchAll(TEMPLATE_TOKEN_PATTERN)].map(
    ([, token]) => token,
  );
  const missingTokens = [...new Set(tokens)].filter(
    (token) => values[token] === undefined,
  );
  const unusedValues = Object.keys(values).filter(
    (key) => !tokens.includes(key),
  );

  if (missingTokens.length > 0) {
    throw new Error(`Missing template values: ${missingTokens.join(', ')}.`);
  }
  if (unusedValues.length > 0) {
    throw new Error(`Unused template values: ${unusedValues.join(', ')}.`);
  }

  return source.replace(TEMPLATE_TOKEN_PATTERN, (_, token) => values[token]);
};

const [firstEducation, ...remainingEducation] = profile.resume.education;
const tex = renderTemplate(templateSource, {
  GENERATOR_PATH: relativeProjectPath(paths.generator),
  TEMPLATE_PATH: relativeProjectPath(paths.template),
  PROFILE_PATH: relativeProjectPath(paths.profile),
  GENERATE_COMMAND,
  GENERATED_TEX_PATH: relativeProjectPath(paths.tex),
  PROFILE_HASH: profileHash,
  ARTIFACT_HASH: artifactHash,
  PDF_TITLE: escapeLatex(`${profile.name} Resume`),
  PDF_AUTHOR: escapeLatex(profile.name),
  PDF_SUBJECT: `${profileFingerprint};${artifactFingerprint}`,
  ACCENT_COLOR: latexHexColor(THEME.resume.accent),
  LINK_COLOR: latexHexColor(THEME.resume.link),
  NAME: escapeLatex(profile.name),
  CONTACT_LINKS: renderContactLinks(),
  SUMMARY: escapeLatex(profile.resume.summary),
  PORTRAIT_PATH: portraitTexPath,
  EXPERIENCE: renderExperience(),
  FIRST_EDUCATION: renderEducationEntry(firstEducation),
  REMAINING_EDUCATION: remainingEducation.map(renderEducationEntry).join('\n'),
  PUBLICATIONS: renderPublications(),
  PROJECTS: renderProjects(),
  SKILLS: renderSkills(),
});

let validationFailed = false;
const fail = (message) => {
  validationFailed = true;
  console.error(message);
  process.exitCode = 1;
};

const cleanSourceBuildArtifacts = () => {
  sourceBuildPaths.forEach((filePath) => rmSync(filePath, { force: true }));
};

if (process.argv.includes('--check')) {
  let currentTex;
  let currentPdf;

  try {
    currentTex = readFileSync(paths.tex, 'utf8');
  } catch {
    fail(`Missing generated TeX: ${relativeProjectPath(paths.tex)}`);
  }

  try {
    currentPdf = readFileSync(paths.pdf);
  } catch {
    fail(`Missing generated PDF: ${relativeProjectPath(paths.pdf)}`);
  }

  if (currentTex !== undefined && currentTex !== tex) {
    fail(`Generated TeX is stale. Run ${GENERATE_COMMAND}.`);
  }

  if (currentPdf !== undefined && !pdfHasArtifactFingerprint(currentPdf)) {
    fail(`Generated PDF is stale. Run ${GENERATE_COMMAND}.`);
  }

  const unexpectedArtifacts = sourceBuildPaths.filter(existsSync);
  if (unexpectedArtifacts.length > 0) {
    fail(
      `Unexpected résumé build artifacts: ${unexpectedArtifacts
        .map(relativeProjectPath)
        .join(', ')}. Run ${GENERATE_COMMAND}.`,
    );
  }

  if (!validationFailed) {
    console.log(
      `Resume artifacts match profile ${profileHash.slice(0, 12)} and generator ${artifactHash.slice(0, 12)}.`,
    );
  }
} else {
  cleanSourceBuildArtifacts();
  writeFileSync(paths.tex, tex);
  mkdirSync(paths.tempRoot, { recursive: true });

  const buildDirectory = mkdtempSync(
    path.join(paths.tempRoot, BUILD_DIRECTORY_PREFIX),
  );
  try {
    const result = spawnSync(
      LATEX_COMMAND,
      [
        '-pdf',
        '-interaction=nonstopmode',
        '-halt-on-error',
        `-auxdir=${buildDirectory}`,
        `-outdir=${buildDirectory}`,
        paths.tex,
      ],
      {
        cwd: resumeDirectory,
        encoding: 'utf8',
        env: {
          ...process.env,
          SOURCE_DATE_EPOCH,
        },
      },
    );

    if (result.status !== 0) {
      console.error(result.stdout);
      console.error(result.stderr);
      throw new Error('LaTeX compilation failed.');
    }

    copyFileSync(path.join(buildDirectory, FILE_NAMES.pdf), paths.pdf);
  } finally {
    rmSync(buildDirectory, { recursive: true, force: true });
    try {
      rmdirSync(paths.tempRoot);
    } catch (error) {
      if (error.code !== 'ENOENT' && error.code !== 'ENOTEMPTY') {
        throw error;
      }
    }
    cleanSourceBuildArtifacts();
  }

  const generatedPdf = readFileSync(paths.pdf);
  if (!pdfHasArtifactFingerprint(generatedPdf)) {
    throw new Error('Generated PDF is missing its artifact fingerprint.');
  }

  console.log(
    `Generated ${relativeProjectPath(paths.tex)} and ${relativeProjectPath(paths.pdf)} from profile ${profileHash.slice(0, 12)} with generator ${artifactHash.slice(0, 12)}.`,
  );
}
