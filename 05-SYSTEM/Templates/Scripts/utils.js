
function getPrefix(tagType) {
  const prefixes = {
    type: "Type",
    status: "Status",
    topic: "Topic",
  };
  return prefixes[tagType] || null;
}

function cleanTagValue(value, prefix) {
  if (!value) {
    return "";
  }

  let cleaned = String(value).trim().replace(/^#/, "");
  if (!cleaned) {
    return "";
  }

  const prefixPattern = new RegExp(`^${prefix}\\/`, "i");
  cleaned = cleaned.replace(prefixPattern, "").trim();
  return cleaned;
}

function unique(values) {
  return [...new Set(values)];
}

function getVaultTags(tp, tagType = "all") {
  const tags = Object.keys(tp.app.metadataCache.getTags() || {}).map((tag) =>
    tag.replace(/^#/, "")
  );

  if (tagType === "all") {
    return unique(tags).sort((a, b) => a.localeCompare(b));
  }

  const prefix = getPrefix(tagType);
  if (!prefix) {
    return [];
  }

  return unique(
    tags
      .filter((tag) => tag.startsWith(`${prefix}/`))
      .map((tag) => cleanTagValue(tag, prefix))
      .filter(Boolean)
  ).sort((a, b) => a.localeCompare(b));
}

async function promptForTag(tp, tagType, options = {}) {
  const prefix = getPrefix(tagType);
  if (!prefix) {
    throw new Error(`Invalid tag type: ${tagType}`);
  }

  const fallbackValue = options.fallbackValue || "NA";
  const createLabel = `+ Create new ${prefix} tag`;
  const createValue = "__create_new__";
  const existing = getVaultTags(tp, tagType);

  const labels = [...existing.map((tag) => `${prefix}/${tag}`), createLabel];
  const items = [...existing, createValue];

  const selected = await tp.system.suggester(
    labels,
    items,
    false,
    `Select ${prefix} tag`
  );

  if (selected === null) {
    return fallbackValue;
  }

  if (selected === createValue) {
    const customValue = await tp.system.prompt(`Enter ${prefix} tag value`);
    return cleanTagValue(customValue, prefix) || fallbackValue;
  }

  return cleanTagValue(selected, prefix) || fallbackValue;
}

function parseTopicInput(text) {
  if (!text) {
    return [];
  }

  return text
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

async function promptForTopics(tp, options = {}) {
  const prefix = "Topic";
  const fallbackValue = options.fallbackValue || "NA";
  const createLabel = "+ Add custom Topic tags (comma-separated)";
  const createValue = "__create_custom_topics__";
  const existing = getVaultTags(tp, "topic").filter((tag) => tag !== "NA");

  if (existing.length === 0) {
    const customTopics = await tp.system.prompt(
      "Enter Topic tags (comma-separated)"
    );
    const cleaned = unique(
      parseTopicInput(customTopics)
        .map((value) => cleanTagValue(value, prefix))
        .filter(Boolean)
    );
    return cleaned.length > 0 ? cleaned : [fallbackValue];
  }

  const labels = [...existing.map((tag) => `${prefix}/${tag}`), createLabel];
  const items = [...existing, createValue];

  const selected = await tp.system.multi_suggester(
    labels,
    items,
    false,
    "Select Topic tags"
  );

  if (!selected || selected.length === 0) {
    return [fallbackValue];
  }

  const selectedWithoutCreate = selected.filter((value) => value !== createValue);
  let customValues = [];

  if (selected.includes(createValue)) {
    const customTopics = await tp.system.prompt(
      "Enter additional Topic tags (comma-separated)"
    );
    customValues = parseTopicInput(customTopics)
      .map((value) => cleanTagValue(value, prefix))
      .filter(Boolean);
  }

  const finalValues = unique(
    [...selectedWithoutCreate, ...customValues]
      .map((value) => cleanTagValue(value, prefix))
      .filter(Boolean)
  );

  return finalValues.length > 0 ? finalValues : [fallbackValue];
}

function toYamlTagLines(prefix, values, fallbackValue = "NA") {
  const lines = (values && values.length > 0 ? values : [fallbackValue]).map(
    (value) => `  - ${prefix}/${value}`
  );
  return lines.join("\n");
}

function toYamlListLines(values) {
  return values.map((value) => `  - ${value}`).join("\n");
}

// ---------------------------------------------------------------------------
// code notes (04-RESOURCES/Code)
//
// languages are derived from the subfolders of CODE_ROOT (folders starting
// with "_" are ignored). fence, topic, and moc are derived deterministically
// from the folder name; CODE_CONFIG_PATH holds optional per-language
// overrides for the irregular cases only:
//
//   { "C#": { "fence": "csharp", "topic": "CSharp", "moc": "MOC - Development" } }
// ---------------------------------------------------------------------------

const CODE_ROOT = "04-RESOURCES/Code";
const CODE_CONFIG_PATH = "05-SYSTEM/Templates/Scripts/code-languages.json";
const DEFAULT_MOC = "MOC - Development";

async function loadCodeLanguageConfig(tp) {
  // config file is optional; deterministic defaults apply when absent
  try {
    const raw = await tp.app.vault.adapter.read(CODE_CONFIG_PATH);
    return JSON.parse(raw);
  } catch (error) {
    return {};
  }
}

function listCodeLanguages(tp) {
  const root = tp.app.vault.getAbstractFileByPath(CODE_ROOT);
  if (!root || !root.children) {
    return [];
  }

  return root.children
    .filter((child) => child.children !== undefined)
    .map((folder) => folder.name)
    .filter((name) => !name.startsWith("_"))
    .sort((a, b) => a.localeCompare(b));
}

function getCodeLanguageMeta(tp, language, config) {
  const overrides = (config && config[language]) || {};

  const fence =
    overrides.fence !== undefined
      ? overrides.fence
      : language.toLowerCase().replace(/[^a-z0-9]/g, "");

  const topic = overrides.topic || language.replace(/[^A-Za-z0-9]/g, "");

  const mocName = overrides.moc || `MOC - ${language}`;
  const moc = tp.file.find_tfile(mocName) ? mocName : DEFAULT_MOC;

  return { language, fence, topic, moc };
}

async function promptForCodeLanguage(tp) {
  const languages = listCodeLanguages(tp);
  const currentFolder = tp.file.folder(false);

  // deterministic: infer from folder when the note already lives in one
  if (languages.includes(currentFolder)) {
    return currentFolder;
  }

  const createLabel = "+ New language folder";
  const createValue = "__create_new__";

  const selected = await tp.system.suggester(
    [...languages, createLabel],
    [...languages, createValue],
    false,
    "Select code language"
  );

  if (selected === null) {
    return "Other";
  }

  if (selected === createValue) {
    const newLanguage = (await tp.system.prompt("New language folder name")) || "";
    const cleaned = newLanguage.trim();
    if (!cleaned) {
      return "Other";
    }
    if (!tp.app.vault.getAbstractFileByPath(`${CODE_ROOT}/${cleaned}`)) {
      await tp.app.vault.createFolder(`${CODE_ROOT}/${cleaned}`);
    }
    return cleaned;
  }

  return selected;
}

async function setupCodeNote(tp) {
  const config = await loadCodeLanguageConfig(tp);
  const language = await promptForCodeLanguage(tp);
  const meta = getCodeLanguageMeta(tp, language, config);

  let name = tp.file.title;
  const prefix = `${language} - `;
  if (name.startsWith(prefix)) {
    name = name.slice(prefix.length).trim();
  } else if (name.startsWith("Untitled")) {
    name = ((await tp.system.prompt("Code note name (without language prefix)")) || name).trim();
  }

  // enforce "<Language> - <Name>" naming and language folder placement
  const targetPath = `${CODE_ROOT}/${language}/${language} - ${name}`;
  if (tp.file.path(true).replace(/\.md$/, "") !== targetPath) {
    await tp.file.move(targetPath);
  }

  const status = await promptForTag(tp, "status", { fallbackValue: "WIP" });
  const extraTopics = await promptForTopics(tp, { fallbackValue: meta.topic });
  const topics = unique([meta.topic, ...extraTopics]).filter(
    (value) => value && value !== "NA"
  );

  const aliases = unique([name, name.replace(/\(\)$/, "")].filter(Boolean));

  // see also: language folder index (only when one exists) + moc
  const seeAlso = [];
  if (tp.app.vault.getAbstractFileByPath(`${CODE_ROOT}/${language}/_README.md`)) {
    seeAlso.push(`[[${CODE_ROOT}/${language}/_README|${language} Code Index]]`);
  }
  seeAlso.push(`[[${meta.moc}]]`);

  return {
    language,
    name,
    fence: meta.fence,
    status,
    description: `${language} - ${name}`,
    mocLink: `[[${meta.moc}]]`,
    topicTagLines: toYamlTagLines("Topic", topics, meta.topic),
    aliasLines: toYamlListLines(aliases),
    seeAlsoLines: seeAlso.map((link) => `- ${link}`).join("\n"),
  };
}

module.exports = {
  getVaultTags,
  promptForTag,
  promptForTopics,
  toYamlTagLines,
  toYamlListLines,
  listCodeLanguages,
  setupCodeNote,
};
