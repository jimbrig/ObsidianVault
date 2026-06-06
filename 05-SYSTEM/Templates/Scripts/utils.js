
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

module.exports = {
  getVaultTags,
  promptForTag,
  promptForTopics,
  toYamlTagLines,
};
