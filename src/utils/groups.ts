// "GPV1.1" -> "Черга 1.1"
export function groupLabel(group: string): string {
  return `Черга ${group.replace(/^GPV/, "")}`;
}

export function sortGroups(groups: string[]): string[] {
  return [...groups].sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true }),
  );
}