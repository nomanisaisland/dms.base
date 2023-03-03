

export function packUrl(
  moduleName: string,
  path = "",
) {
  return `/${moduleName}/${path}`;
}

export function packBuildUrl(
  moduleName: string,
  path = "",
) {
  return `/${moduleName}/build/${path}`;
}