export function EmergencyNotice() {
  return (
    <details className="notice">
      <summary className="notice__summary">
        <span className="notice__icon" aria-hidden="true">
          ⚠️
        </span>
        <span>Під час аварійних відключень графіки не діють</span>
      </summary>
      <div className="notice__body">
        <p>
          Якщо енергосистема зазнала пошкоджень (через обстріли, негоду чи
          аварії), застосовуються аварійні відключення, і вони не відповідають
          графіку.
        </p>
        <p>
          У такий момент застосунок може показувати «Світло є», хоча світла
          немає. Стежте за повідомленнями вашого обленерго та Укренерго.
        </p>
      </div>
    </details>
  );
}