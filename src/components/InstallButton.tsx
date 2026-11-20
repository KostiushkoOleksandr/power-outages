import { useInstallPrompt } from "../hooks/useInstallPrompt";

export function InstallButton() {
  const { installed, canInstall, showIosHint, install } = useInstallPrompt();

  if (installed) return null;

  if (canInstall) {
    return (
      <button type="button" className="install" onClick={install}>
        <span aria-hidden="true">📲</span>
        Встановити застосунок
      </button>
    );
  }

  if (showIosHint) {
    return (
      <p className="install-hint">
        Щоб встановити: натисніть «Поділитись» <span aria-hidden="true">⬆️</span>{" "}
        у Safari і виберіть «На початковий екран».
      </p>
    );
  }

  return null;
}