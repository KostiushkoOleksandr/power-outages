interface GroupSelectProps {
  groups: string[];
  value: string;
  onChange: (group: string) => void;
}

export function GroupSelect({ groups, value, onChange }: GroupSelectProps) {
  return (
    <label>
      Група:{" "}
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {groups.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>
    </label>
  );
}